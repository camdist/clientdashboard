import {database,bucket} from '@/db/raw';
import {validateBackup} from '@/lib/backup-validation';
import {relationshipError} from '@/lib/relationships';
async function live(db:D1Database){return (await db.prepare("SELECT payload FROM records WHERE kind NOT IN ('meta','trash','restore-session')").all()).results.map((x:any)=>JSON.parse(x.payload))}
export async function GET(){try{const db=database(),records=await live(db),rows=await db.prepare("SELECT id,payload FROM records WHERE id LIKE 'invoice-counter-%' AND kind='meta'").all();return Response.json({product:'Client Dashboard',backupVersion:1,exportedAt:new Date().toISOString(),records,invoiceCounters:Object.fromEntries(rows.results.map((x:any)=>[x.id,Number(x.payload)]))});}catch{return Response.json({error:'Backup records could not be read.'},{status:503})}}
export async function POST(req:Request){try{const data:any=await req.json(),db=database();
 if(data.action==='preview'){
  const backup=validateBackup(data.backup),current=await live(db),map=new Map(current.map(r=>[r.id,r]));const records=backup.records.filter(r=>!map.has(r.id));
  for(const old of backup.records){const existing=map.get(old.id);if(existing&&(existing.kind!==old.kind||existing.client!==old.client))return Response.json({error:'An existing record ID belongs to a different type or client. Use a separate workspace or resolve the conflict first.'},{status:409})}
  const error=relationshipError([...current,...records]);if(error)return Response.json({error},{status:400});
  const fileIds=new Set(records.filter(r=>r.kind==='resource'&&r.type==='File').map(r=>r.id)),files=backup.files.filter(f=>fileIds.has(f.id));const id='restore-'+crypto.randomUUID(),session={id,kind:'restore-session',client:'',expiresAt:Date.now()+60*60*1000,records,files,invoiceCounters:backup.invoiceCounters||{}};
  for(const r of records)if(r.kind==='resource'&&r.type==='File'){r.storageKey=id+'/'+r.id;r.url='/api/files?id='+r.id;}
  await db.prepare('INSERT INTO records VALUES (?,?,?,?)').bind(id,session.kind,'',JSON.stringify(session)).run();return Response.json({session:id,newRecords:records.length,kept:backup.records.length-records.length,files,expiresAt:session.expiresAt});
 }
 if(data.action==='commit'){
  const row:any=await db.prepare("SELECT payload FROM records WHERE id=? AND kind='restore-session'").bind(data.session).first();if(!row)return Response.json({error:'Restore preview expired or was cancelled.'},{status:404});const session=JSON.parse(row.payload);if(session.expiresAt<Date.now())return Response.json({error:'Preview expired. Cancel and start again.'},{status:409});
  const current=await live(db),map=new Map(current.map(r=>[r.id,r]));for(const r of session.records){const old=map.get(r.id);if(old&&(old.kind!==r.kind||old.client!==r.client))return Response.json({error:'Records changed since preview. Cancel and preview again.'},{status:409})}
  const candidates=session.records.filter((r:any)=>!map.has(r.id)),error=relationshipError([...current,...candidates]);if(error)return Response.json({error},{status:409});
  for(const f of session.files){const obj=await bucket().head(session.id+'/'+f.id);if(!obj||obj.size!==f.size||obj.customMetadata?.sha256!==f.sha256)return Response.json({error:'A backup file has not finished uploading. Retry restore.'},{status:409})}
  let restored=0;for(let i=0;i<candidates.length;i+=50){const result=await db.batch(candidates.slice(i,i+50).map((r:any)=>db.prepare('INSERT OR IGNORE INTO records VALUES (?,?,?,?)').bind(r.id,r.kind,r.client,JSON.stringify(r))));restored+=result.reduce((n:number,r:any)=>n+Number(r.meta.changes||0),0)}
  const counters=new Map<string,number>();for(const r of [...current,...candidates]){const m=r.kind==='invoice'&&r.invoiceNumber?.match(/^INV-(\d{4})-(\d+)$/);if(m)counters.set('invoice-counter-'+m[1],Math.max(counters.get('invoice-counter-'+m[1])||0,Number(m[2])))}
  for(const [id,count] of Object.entries(session.invoiceCounters||{}))if(/^invoice-counter-\d{4}$/.test(id)&&Number.isSafeInteger(count)&&Number(count)>=0)counters.set(id,Math.max(counters.get(id)||0,Number(count)));
  if(counters.size)await db.batch([...counters].map(([id,n])=>db.prepare("INSERT INTO records VALUES (?,'meta','',?) ON CONFLICT(id) DO UPDATE SET payload=CAST(MAX(CAST(records.payload AS INTEGER),CAST(excluded.payload AS INTEGER)) AS TEXT)").bind(id,String(n))));
  const used=new Set((await live(db)).filter(r=>r.kind==='resource').map(r=>r.storageKey||r.id));for(const f of session.files){const key=session.id+'/'+f.id;if(!used.has(key))await bucket().delete(key)}
  await db.prepare('DELETE FROM records WHERE id=?').bind(session.id).run();return Response.json({restored,kept:session.records.length-restored});
 }
 return Response.json({error:'Choose preview or commit.'},{status:400});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Restore failed.'},{status:400})}}
export async function DELETE(req:Request){try{const {session}:any=await req.json(),db=database(),row:any=await db.prepare("SELECT payload FROM records WHERE id=? AND kind='restore-session'").bind(session).first();if(!row)return Response.json({ok:true});const item=JSON.parse(row.payload),records=await live(db),used=new Set(records.filter(r=>r.kind==='resource').map(r=>r.storageKey||r.id));for(const f of item.files){const key=item.id+'/'+f.id;if(!used.has(key))await bucket().delete(key)}await db.prepare('DELETE FROM records WHERE id=?').bind(item.id).run();return Response.json({ok:true});}catch{return Response.json({error:'Could not cancel staged restore.'},{status:503})}}
