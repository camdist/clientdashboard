import {database} from '@/db/raw';
import {trashStatement} from '@/lib/trash';
import {validPlatform,platformKey,socialPlatforms} from '@/lib/social';
export async function POST(req:Request){try{
 const input:any=await req.json();
 if(!input||typeof input.id!=='string'||!/^social-[a-f0-9-]{36}$/.test(input.id)||typeof input.client!=='string'||typeof input.name!=='string'||!input.name.trim()||input.name.length>150||!validPlatform(input.platform))return Response.json({error:'Choose a client and enter an account name and platform.'},{status:400});
 const r={id:input.id,kind:'social-account',client:input.client,name:input.name.trim(),platform:socialPlatforms.find(p=>platformKey(p)===platformKey(input.platform))||input.platform.trim(),url:String(input.url||'').trim(),externalId:String(input.externalId||'').trim(),apiVersion:String(input.apiVersion||'').trim()};
 if(r.url&&(!/^https:\/\//.test(r.url)||r.url.length>2000))return Response.json({error:'Use a full https:// account or page link.'},{status:400});
 if(r.externalId.length>150||!/^[-\w.:@]*$/.test(r.externalId)||r.apiVersion.length>20)return Response.json({error:'Check the account ID and API version.'},{status:400});
 const db=database(),prior:any=await db.prepare('SELECT kind,client,payload FROM records WHERE id=?').bind(r.id).first();
 if(prior&&(prior.kind!==r.kind||prior.client!==r.client))return Response.json({error:'Account identity cannot be changed.'},{status:400});
 if(!await db.prepare("SELECT id FROM records WHERE id=? AND kind='client'").bind(r.client).first())return Response.json({error:'Select an existing client.'},{status:400});
 if(prior){const old=JSON.parse(prior.payload);if(old.platform!==r.platform||old.externalId!==r.externalId){const rows=await db.prepare("SELECT payload FROM records WHERE kind='content' AND client=?").bind(r.client).all();if(rows.results.some((x:any)=>JSON.parse(x.payload).socialAccountId===r.id))return Response.json({error:'Unlink this account’s content before changing its platform or account ID.'},{status:400});}}
 await db.prepare('INSERT INTO records (id,kind,client,payload) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').bind(r.id,r.kind,r.client,JSON.stringify(r)).run();return Response.json({record:r});
 }catch{return Response.json({error:'Account could not be saved. Please retry.'},{status:503})}}
export async function DELETE(req:Request){try{const {id}:any=await req.json(),db=database();const row:any=await db.prepare("SELECT id,payload FROM records WHERE id=? AND kind='social-account'").bind(id).first();if(!row)return Response.json({error:'Account not found.'},{status:404});const rows=await db.prepare("SELECT payload FROM records WHERE kind='content'").all();if(rows.results.some((x:any)=>JSON.parse(x.payload).socialAccountId===id))return Response.json({error:'Unlink content from this account before removing it.'},{status:400});await db.batch([trashStatement(db,JSON.parse(row.payload)),db.prepare('DELETE FROM records WHERE id=?').bind(id)]);return Response.json({ok:true});}catch{return Response.json({error:'Could not remove account.'},{status:503})}}
