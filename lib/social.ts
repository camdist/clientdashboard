export const socialPlatforms=['Instagram','Facebook','TikTok','YouTube','Pinterest','LinkedIn','Blog','X'];
export const syncPlatforms=['Instagram','Facebook','TikTok','YouTube','Pinterest','LinkedIn'];
export function platformKey(value:string){return value.trim().toLowerCase()}
export function validPlatform(value:unknown):value is string{return typeof value==='string'&&value.trim().length>0&&value.trim().length<=60&&!/[\x00-\x1f\x7f]/.test(value)}
export function secretName(id:string){return 'SOCIAL_TOKEN_'+id.replace(/-/g,'_').toUpperCase()}
export function allPlatforms(records:{kind:string;platform?:string}[]){return [...new Set([...socialPlatforms,...records.filter(r=>['content','social-account'].includes(r.kind)&&r.platform).map(r=>r.platform!)])].sort((a,b)=>a.localeCompare(b))}
export function extractPostId(platform:string,value:string){
 const input=value.trim();
 if(!input)return '';
 if(!input.startsWith('https://'))return input;
 const url=new URL(input),host=url.hostname.replace(/^www\./,'');
 const allowed:Record<string,string[]>= {YouTube:['youtube.com','m.youtube.com','youtu.be'],TikTok:['tiktok.com','m.tiktok.com'],Pinterest:['pinterest.com'],Instagram:['instagram.com'],Facebook:['facebook.com','m.facebook.com'],LinkedIn:['linkedin.com']};
 if(!allowed[platform]?.includes(host))throw Error('Use the full post link from the selected platform, or its exact API post ID. Shortened links need the full destination link.');
 if(platform==='YouTube')return host==='youtu.be'?url.pathname.split('/')[1]:url.searchParams.get('v')||url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/)?.[1]||'';
 if(platform==='TikTok')return url.pathname.match(/\/video\/(\d+)/)?.[1]||'';
 if(platform==='Pinterest')return url.pathname.match(/\/pin\/(\d+)/)?.[1]||'';
 if(platform==='Facebook')return url.pathname.match(/\/posts\/(\d+)/)?.[1]||url.searchParams.get('story_fbid')||'';
 if(platform==='Instagram')return ''; // Resolve permalink against the connected account's media.
 if(platform==='LinkedIn')throw Error('LinkedIn needs the exact share or ugcPost URN. Follow the LinkedIn guide.');
 return '';
}
export function metricValue(record:any,key:string):number|null{
 if(record.metricsSource==='api'&&!['leads','conversions'].includes(key))return typeof record.syncedMetrics?.[key]==='number'?record.syncedMetrics[key]:null;
 if(!['views','likes','comments','shares','clicks','leads','conversions'].includes(key)&&record[key]===undefined)return null;
 return Number(record[key]||0);
}
