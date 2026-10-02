import {database,bucket} from '@/db/raw';
import {relationshipError} from '@/lib/relationships';
export async function GET(){const rows=await database().prepare("SELECT payload FROM records WHERE kind='trash'").all();return Response.json({items:rows.results.map((x:any)=>JSON.parse(x.payload)).sort((a:any,b:any)=>b.deletedAt.localeCompare(a.deletedAt))})}
export async function POST(req:Request){try{
 const {id}:any=await req.json(),db=database();const row:any=await db.prepare("SELECT payload FROM records WHERE id=? AND kind='trash'").bind(id).first();if(!row)return Response.json({error:'Trash item not found.'},{status:404});const item=JSON.parse(row.payload),r=item.record;
 const live=await db.prepare("SELECT payload FROM records WHERE kind NOT IN ('meta','trash','restore-session')").all(),records=live.results.map((x:any)=>JSON.parse(x.payload));if(records.some((x:any)=>x.id===r.id))return Response.json({error:'A live record already has this ID.'},{status:409});
 const error=relationshipError([...records,r]);if(error)return Response.json({error:'Restore the related client or project first. '+error},{status:409});
 if(r.kind==='resource'&&r.type==='File'&&!await bucket().head(r.storageKey||r.id))return Response.json({error:'The stored file is missing. Restore it from a full backup.'},{status:409});
 const restored=[r],statements=[db.prepare('INSERT INTO records VALUES (?,?,?,?)').bind(r.id,r.kind,r.client,JSON.stringify(r))];
 for(const old of item.related||[]){const current=records.find((x:any)=>x.id===old.id);if(!current||current.client!==r.client)continue;let next:any=null;
  if(r.kind==='content'&&current.kind==='task'&&!current.contentId&&old.contentId===r.id)next={...current,contentId:r.id};
  if(r.kind==='resource'&&current.kind==='content'&&old.resourceIds?.includes(r.id)&&!current.resourceIds?.includes(r.id))next={...current,resourceIds:[...(current.resourceIds||[]),r.id]};
  if(next){restored.push(next);statements.push(db.prepare('UPDATE records SET payload=? WHERE id=? AND payload=?').bind(JSON.stringify(next),next.id,JSON.stringify(current)))}
 }
 statements.push(db.prepare('DELETE FROM records WHERE id=?').bind(id));await db.batch(statements);return Response.json({records:restored});
 }catch{return Response.json({error:'Could not restore this item. Reload and try again.'},{status:503})}}
export async function DELETE(req:Request){try{const {id}:any=await req.json(),db=database(),row:any=await db.prepare("SELECT payload FROM records WHERE id=? AND kind='trash'").bind(id).first();if(!row)return Response.json({error:'Trash item not found.'},{status:404});const r=JSON.parse(row.payload).record;if(r.kind==='resource'&&r.type==='File')await bucket().delete(r.storageKey||r.id);await db.prepare('DELETE FROM records WHERE id=?').bind(id).run();return Response.json({ok:true});}catch{return Response.json({error:'Could not permanently remove this item.'},{status:503})}}
