import {businessSchema} from './business';
import {validFormat} from './content-types';
import {validPlatform} from './social';
const kinds=['client','project','task','invoice','content','resource','settings','social-account'];
const safeText=(v:any,max:number)=>typeof v==='string'&&v.length<=max;
export function validateBackup(input:any){
 if(input?.product!=='Client Dashboard'||input?.backupVersion!==1||!Array.isArray(input.records)||input.records.length>2000||!Array.isArray(input.files)||input.files.length>2000)throw Error('Choose a full backup made by Client Dashboard.');
 if(JSON.stringify(input).length>8*1024*1024)throw Error('Backup manifest exceeds 8 MB.');
 const ids=new Set<string>();for(const r of input.records){
  if(!r||!kinds.includes(r.kind)||!safeText(r.id,100)||!r.id||ids.has(r.id)||r.id==='initialized'||r.id.startsWith('invoice-counter-')||r.id.startsWith('trash-')||r.id.startsWith('restore-')||!safeText(r.client,100))throw Error('Backup record identity is invalid.');ids.add(r.id);
  if(r.kind==='settings'&&(r.id!=='workspace-settings'||r.client!==''))throw Error('Backup settings identity is invalid.');
  if(['client','project','task','invoice','settings'].includes(r.kind)&&!businessSchema.safeParse(r).success)throw Error('A business record is invalid: '+r.id);
  if(r.kind==='client'&&r.id!==r.client)throw Error('Backup client identity is invalid.');
  if(r.kind==='content'){
   if(!safeText(r.title,250)||!r.title.trim()||!validFormat(r.format)||!validPlatform(r.platform)||!['Idea','In progress','In review','Scheduled','Published'].includes(r.status)||!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||new Date(r.date+'T12:00:00Z').toISOString().slice(0,10)!==r.date||!Array.isArray(r.resourceIds||[]))throw Error('A content record is invalid: '+r.id);
   if(r.metricsSource!==undefined&&!['manual','api','import'].includes(r.metricsSource))throw Error('Analytics source is invalid.');
   if((r.resourceIds||[]).some((id:any)=>!safeText(id,100)||!id)||!safeText(r.owner||'',500)||!safeText(r.notes||'',20000))throw Error('Content details are invalid.');
   for(const k of ['views','likes','comments','shares','clicks','leads','conversions'])if(r[k]!==undefined&&(!Number.isFinite(r[k])||r[k]<0))throw Error('A manual metric is invalid.');
   if(r.syncedMetrics&&Object.entries(r.syncedMetrics).some(([k,v])=>!['views','likes','comments','shares','clicks','impressions','reach','saves','reactions','pinClicks'].includes(k)||typeof v!=='number'||!Number.isFinite(v)))throw Error('Stored analytics are invalid.');
  }
  if(r.kind==='resource'&&(!safeText(r.name,2000)||!['File','Link'].includes(r.type)||(r.type==='Link'&&!/^https?:\/\//i.test(r.url))))throw Error('A resource record is invalid.');
  if(r.kind==='social-account'&&(!/^social-[a-f0-9-]{36}$/.test(r.id)||!safeText(r.name,150)||!r.name.trim()||!validPlatform(r.platform)||!safeText(r.externalId||'',150)||!safeText(r.apiVersion||'',20)||r.url&&!/^https:\/\//.test(r.url)))throw Error('An account record is invalid.');
  if(r.kind==='invoice'&&r.invoiceNumber&&!/^INV-\d{4}-\d{5,}$/.test(r.invoiceNumber))throw Error('An invoice reference is invalid.');
  if(r.kind==='invoice'&&r.billingSnapshot)for(const identity of [r.billingSnapshot.business,r.billingSnapshot.client])if(!identity||!safeText(identity.name,500)||identity.logo&&(!safeText(identity.logo,200000)||!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+=*$/.test(identity.logo)))throw Error('An invoice billing snapshot is invalid.');
  if(JSON.stringify(r).length>300000)throw Error('A backup record is too large.');
 }
 const files=new Map<string,any>();let total=0;for(const f of input.files){if(!f||!/^[-\w]{1,100}$/.test(f.id)||files.has(f.id)||!Number.isInteger(f.size)||f.size<0||f.size>20*1024*1024||! /^[a-f0-9]{64}$/.test(f.sha256))throw Error('Backup file details are invalid.');files.set(f.id,f);total+=f.size;}
 if(total>200*1024*1024)throw Error('Backup files exceed 200 MB.');
 const resources=input.records.filter((r:any)=>r.kind==='resource'&&r.type==='File');if(resources.length!==files.size||resources.some((r:any)=>files.get(r.id)?.size!==r.size))throw Error('Every uploaded resource needs its matching backup file.');
 return input as {records:any[];files:{id:string;size:number;sha256:string}[];invoiceCounters?:Record<string,number>};
}
