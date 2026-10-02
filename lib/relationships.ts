export function relationshipError(records:any[]):string|null {
 const map=new Map(records.map(r=>[r.id,r]));const invoices=new Map<string,string>();
 for(const r of records)if(r.kind==='invoice'&&r.invoiceNumber){if(invoices.has(r.invoiceNumber)&&invoices.get(r.invoiceNumber)!==r.id)return 'An invoice reference is already used by another record. Restore into a fresh workspace.';invoices.set(r.invoiceNumber,r.id)}
 for(const r of records){
  if(r.kind==='settings')continue;
  if(r.kind==='client'){if(r.client!==r.id)return 'A client identity does not match its record.';continue}
  if(map.get(r.client)?.kind!=='client')return 'A record refers to a missing client: '+(r.title||r.name||r.id);
  for(const [field,kind] of [['projectId','project'],['contentId','content'],['socialAccountId','social-account']])if(r[field]){const linked=map.get(r[field]);if(!linked||linked.kind!==kind||linked.client!==r.client)return 'A linked record is missing or belongs to another client: '+(r.title||r.name||r.id)}
  if(r.kind==='content'&&r.socialAccountId&&map.get(r.socialAccountId)?.platform!==r.platform)return 'Content channel and account do not match.';
  if(r.kind==='content')for(const id of r.resourceIds||[]){const resource=map.get(id);if(!resource||resource.kind!=='resource'||resource.client!==r.client)return 'A content resource is missing or belongs to another client.'}
  if(r.kind==='invoice'&&r.projectId&&map.get(r.projectId)?.currency!==r.currency)return 'An invoice currency differs from its project.';
 }
 return null;
}
