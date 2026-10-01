import {extractPostId} from './social';
export class SyncError extends Error{}
type Metrics=Record<string,number>;
function add(out:Metrics,key:string,value:any){if(value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value))&&Number(value)>=0)out[key]=Number(value)}
async function json(url:string,token:string,init:RequestInit={}){
 const response=await fetch(url,{...init,redirect:'manual',signal:AbortSignal.timeout(15000),headers:{...(token?{Authorization:'Bearer '+token}:{}),...init.headers}});
 if(!response.ok)throw new SyncError(response.status===401?'Access expired. Replace this account’s Cloudflare secret with a new access token.':response.status===403?'The platform denied access. Check account ownership, app approval and analytics permissions.':response.status===429?'Platform rate limit reached. Try again later.':'The platform could not return this post. Check its ID and permissions.');
 const data:any=await response.json();if(data.error&&data.error.code!=='ok')throw new SyncError('The platform rejected this request. Check your token, permissions and post ID.');return data;
}
export async function fetchPostMetrics(account:any,postRef:string,token:string,now=new Date()):Promise<{metrics:Metrics;postId:string;period:string}>{
 const p=account.platform,out:Metrics={};let id=extractPostId(p,postRef),period='Lifetime counters as reported by platform';
 if(p==='YouTube'){
  if(!/^[\w-]{11}$/.test(id))throw new SyncError('Paste the full YouTube video or Shorts link.');
  const url=new URL('https://www.googleapis.com/youtube/v3/videos');url.search=new URLSearchParams({part:'snippet,statistics',id,key:token}).toString();
  const d=await json(url.href,'');const video=d.items?.[0];if(!video||video.id!==id)throw new SyncError('Video not found or unavailable.');
  if(video.snippet?.channelId!==account.externalId)throw new SyncError('This video belongs to a different YouTube channel. Check the account’s channel ID.');
  add(out,'views',video.statistics?.viewCount);add(out,'likes',video.statistics?.likeCount);add(out,'comments',video.statistics?.commentCount);
 }else if(p==='TikTok'){
  if(!/^\d+$/.test(id))throw new SyncError('Paste the full TikTok link containing /video/ followed by its number.');
  const user=await json('https://open.tiktokapis.com/v2/user/info/?fields=open_id',token);
  if(user.data?.user?.open_id!==account.externalId)throw new SyncError('This token belongs to a different TikTok account. Check the account’s open_id.');
  const d=await json('https://open.tiktokapis.com/v2/video/query/?fields=id,view_count,like_count,comment_count,share_count',token,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({filters:{video_ids:[id]}})}),video=d.data?.videos?.find((v:any)=>v.id===id);
  if(!video)throw new SyncError('Video not found for the connected TikTok account.');
  for(const [key,field] of [['views','view_count'],['likes','like_count'],['comments','comment_count'],['shares','share_count']])add(out,key,video[field]);
 }else if(p==='Pinterest'){
  if(!/^\d+$/.test(id))throw new SyncError('Paste a full Pinterest /pin/ link or numeric Pin ID.');
  const user=await json('https://api.pinterest.com/v5/user_account',token);if(user.username?.toLowerCase()!==account.externalId.toLowerCase())throw new SyncError('The token does not match this Pinterest username.');
  const pin=await json('https://api.pinterest.com/v5/pins/'+id,token);if(pin.id!==id||pin.board_owner?.username?.toLowerCase()!==account.externalId.toLowerCase())throw new SyncError('This Pin belongs to another account. Choose a Pin owned by this account.');
  const end=new Date(now);end.setUTCDate(end.getUTCDate()-1);const start=new Date(end);start.setUTCDate(start.getUTCDate()-29);const date=(d:Date)=>d.toISOString().slice(0,10);
  const params=new URLSearchParams({start_date:date(start),end_date:date(end),metric_types:'IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK'});
  const d=await json('https://api.pinterest.com/v5/pins/'+id+'/analytics?'+params,token),values=d.all?.summary_metrics;if(!values)throw new SyncError('Pinterest returned no report for this Pin and date range.');
  for(const [key,field] of [['impressions','IMPRESSION'],['saves','SAVE'],['pinClicks','PIN_CLICK'],['clicks','OUTBOUND_CLICK']])add(out,key,values[field]);
  period='Last 30 complete days: '+date(start)+' to '+date(end);
 }else if(p==='Instagram'){
  if(!/^v\d+\.\d+$/.test(account.apiVersion)||!/^\d+$/.test(account.externalId))throw new SyncError('Add the numeric Instagram account ID and supported Graph API version from your Meta app.');
  const base='https://graph.instagram.com/'+account.apiVersion;let after='',found=false;
  for(let page=0;page<5&&!found;page++){
   const q=new URLSearchParams({fields:'id,permalink',limit:'100',...(after?{after}:{})});const d=await json(base+'/'+account.externalId+'/media?'+q,token);
   const media=d.data?.find((m:any)=>id?m.id===id:m.permalink?.replace(/\/$/,'')===postRef.trim().split('?')[0].replace(/\/$/,''));if(media){id=media.id;found=true;break}after=d.paging?.cursors?.after||'';if(!d.paging?.next||!after)break;
  }
  if(!found)throw new SyncError('Post not found among this account’s 500 most recent media items. Check the account and post link.');
  const d=await json(base+'/'+id+'?fields=id,like_count,comments_count',token);if(d.id!==id)throw new SyncError('The media response did not match this post.');add(out,'likes',d.like_count);add(out,'comments',d.comments_count);
  for(const [key,metric] of [['views','views'],['reach','reach'],['saves','saved'],['shares','shares']]){
   try{const insights=await json(base+'/'+id+'/insights?metric='+metric,token);add(out,key,insights.data?.[0]?.values?.[0]?.value??insights.data?.[0]?.total_value?.value)}catch(e){if(!(e instanceof SyncError))throw e;/* Unsupported media metrics stay absent, never become zero. */}
  }
 }else if(p==='Facebook'){
  if(!/^v\d+\.\d+$/.test(account.apiVersion)||!/^\d+$/.test(account.externalId))throw new SyncError('Add the numeric Facebook Page ID and Graph API version from your Meta app.');
  if(/^\d+$/.test(id))id=account.externalId+'_'+id;
  if(!/^\d+_\d+$/.test(id)||!id.startsWith(account.externalId+'_'))throw new SyncError('Use this Page’s numeric post ID (PageID_PostID). Some Reel/share links need the API post ID.');
  const d=await json('https://graph.facebook.com/'+account.apiVersion+'/'+id+'?fields=id,from,reactions.limit(0).summary(true),comments.limit(0).summary(true),shares',token);
  if(d.id!==id||d.from?.id!==account.externalId)throw new SyncError('This post is not owned by the selected Facebook Page.');
  add(out,'reactions',d.reactions?.summary?.total_count);add(out,'comments',d.comments?.summary?.total_count);add(out,'shares',d.shares?.count);
 }else if(p==='LinkedIn'){
  if(!/^\d+$/.test(account.externalId)||!/^\d{6}$/.test(account.apiVersion))throw new SyncError('Enter the numeric organization ID and a supported LinkedIn API version, such as YYYYMM.');
  if(!/^urn:li:(share|ugcPost):\d+$/.test(id))throw new SyncError('Enter the exact LinkedIn share or ugcPost URN. A public activity link is not enough.');
  const q=new URLSearchParams({q:'organizationalEntity',organizationalEntity:'urn:li:organization:'+account.externalId,[id.includes(':ugcPost:')?'ugcPosts':'shares']:'List('+id+')'});
  const d=await json('https://api.linkedin.com/rest/organizationalEntityShareStatistics?'+q,token,{headers:{'Linkedin-Version':account.apiVersion,'X-Restli-Protocol-Version':'2.0.0'}});
  const row=d.elements?.find((r:any)=>r.organizationalEntity==='urn:li:organization:'+account.externalId&&(r.share===id||r.ugcPost===id));if(!row)throw new SyncError('No verified post report returned for this organization. Check the post URN and permissions.');
  for(const [key,field] of [['impressions','impressionCount'],['likes','likeCount'],['comments','commentCount'],['shares','shareCount'],['clicks','clickCount']]){const value=row.totalShareStatistics?.[field];if(key==='likes'&&typeof value==='number'&&Number.isFinite(value))out[key]=value;else add(out,key,value)}period='Organic lifetime counters as reported by LinkedIn';
 }else throw new SyncError('Account registration is supported. Automatic syncing for this platform is not included yet; use its native analytics report.');
 if(!Object.keys(out).length)throw new SyncError('No supported metrics were returned. Check permissions.');
 return {metrics:out,postId:id,period};
}
