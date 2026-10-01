import {env} from 'cloudflare:workers';
import {database} from '@/db/raw';
import {secretName,syncPlatforms} from '@/lib/social';
import {fetchPostMetrics,SyncError} from '@/lib/social-sync';
export async function POST(req:Request){try{
 const {id}:any=await req.json();if(typeof id!=='string'||id.length>100)return Response.json({error:'Choose a saved content item.'},{status:400});
 const db=database(),row:any=await db.prepare("SELECT payload FROM records WHERE id=? AND kind='content'").bind(id).first();if(!row)return Response.json({error:'Content not found.'},{status:404});const post=JSON.parse(row.payload);
 if(post.status!=='Published'||!post.socialAccountId||!post.postRef)return Response.json({error:'Mark the item Published, select its account, add its post link or ID, then save before syncing.'},{status:400});
 const accountRow:any=await db.prepare("SELECT payload FROM records WHERE id=? AND kind='social-account' AND client=?").bind(post.socialAccountId,post.client).first();if(!accountRow)return Response.json({error:'The account must belong to this client.'},{status:400});const account=JSON.parse(accountRow.payload);
 if(!syncPlatforms.includes(account.platform))return Response.json({error:'This platform can be registered, but has no automatic sync adapter in this release.'},{status:400});
 if(account.platform!==post.platform)return Response.json({error:'Content channel and linked account must match.'},{status:400});
 if(post.metricsSyncedAt&&Date.now()-Date.parse(post.metricsSyncedAt)<60000)return Response.json({error:'These metrics were just updated. Wait one minute before syncing again.'},{status:429});
 const token=(env as unknown as Record<string,string|undefined>)[secretName(account.id)];if(!token)return Response.json({error:'Finish this account’s connection guide: add its access token or API key as a Cloudflare secret.'},{status:409});
 const result=await fetchPostMetrics(account,post.postRef,token),record={...post,metricsSource:'api',syncedMetrics:result.metrics,metricsPostId:result.postId,metricsPeriod:result.period,metricsSyncedAt:new Date().toISOString()};
 const write=await db.prepare('UPDATE records SET payload=? WHERE id=? AND payload=?').bind(JSON.stringify(record),post.id,row.payload).run();if(!write.meta.changes)return Response.json({error:'The content changed while syncing. Reload it and try again.'},{status:409});
 return Response.json({record});
 }catch(e){return Response.json({error:e instanceof SyncError?e.message:'Metrics could not be updated. Previous data is preserved; try again.'},{status:e instanceof SyncError?400:503})}}
