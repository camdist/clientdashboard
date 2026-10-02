const encoder=new TextEncoder(),decoder=new TextDecoder();
export const backupLimit=200*1024*1024;
export function crc32(bytes:Uint8Array){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
function header(size:number){const bytes=new Uint8Array(size);return {bytes,view:new DataView(bytes.buffer)}}
export async function backupZip(entries:{name:string;data:Blob}[]){
 const parts:BlobPart[]=[],directory:BlobPart[]=[];let offset=0,centralSize=0;
 for(const entry of entries){const name=encoder.encode(entry.name),bytes=new Uint8Array(await entry.data.arrayBuffer()),crc=crc32(bytes),local=header(30),central=header(46);
  local.view.setUint32(0,0x04034b50,true);local.view.setUint16(4,20,true);local.view.setUint16(6,0x800,true);local.view.setUint32(14,crc,true);local.view.setUint32(18,bytes.length,true);local.view.setUint32(22,bytes.length,true);local.view.setUint16(26,name.length,true);
  central.view.setUint32(0,0x02014b50,true);central.view.setUint16(4,20,true);central.view.setUint16(6,20,true);central.view.setUint16(8,0x800,true);central.view.setUint32(16,crc,true);central.view.setUint32(20,bytes.length,true);central.view.setUint32(24,bytes.length,true);central.view.setUint16(28,name.length,true);central.view.setUint32(42,offset,true);
  parts.push(local.bytes,name,entry.data);directory.push(central.bytes,name);offset+=30+name.length+bytes.length;centralSize+=46+name.length;
 }
 const end=header(22);end.view.setUint32(0,0x06054b50,true);end.view.setUint16(8,entries.length,true);end.view.setUint16(10,entries.length,true);end.view.setUint32(12,centralSize,true);end.view.setUint32(16,offset,true);
 return new Blob([...parts,...directory,end.bytes],{type:'application/zip'});
}
export async function readBackupZip(file:Blob){
 if(file.size>backupLimit)throw Error('Use a full backup ZIP under 200 MB.');
 const tail=new Uint8Array(await file.slice(Math.max(0,file.size-65557)).arrayBuffer()),tailView=new DataView(tail.buffer);let end=-1;
 for(let i=tail.length-22;i>=0;i--)if(tailView.getUint32(i,true)===0x06054b50){end=i;break}
 if(end<0||tailView.getUint16(end+4,true)||tailView.getUint16(end+6,true))throw Error('This is not a supported dashboard backup.');
 const count=tailView.getUint16(end+10,true),size=tailView.getUint32(end+12,true),start=tailView.getUint32(end+16,true);if(count>2001||size>1024*1024||start+size>file.size)throw Error('Backup directory is invalid.');
 const central=new Uint8Array(await file.slice(start,start+size).arrayBuffer()),v=new DataView(central.buffer),entries=new Map<string,{offset:number;size:number;crc:number}>();let offset=0;
 for(let n=0;n<count;n++){if(offset+46>central.length||v.getUint32(offset,true)!==0x02014b50)throw Error('Backup directory is damaged.');const flags=v.getUint16(offset+8,true),method=v.getUint16(offset+10,true),length=v.getUint32(offset+24,true),compressed=v.getUint32(offset+20,true),nameSize=v.getUint16(offset+28,true),extra=v.getUint16(offset+30,true),comment=v.getUint16(offset+32,true),local=v.getUint32(offset+42,true);if(flags&1||method!==0||compressed!==length||offset+46+nameSize+extra+comment>central.length)throw Error('Use the unmodified ZIP produced by Full backup.');const name=decoder.decode(central.slice(offset+46,offset+46+nameSize));if(!/^(manifest\.json|files\/[\w-]{1,100})$/.test(name)||entries.has(name)||local+30+length>start)throw Error('Backup entry is invalid.');entries.set(name,{offset:local,size:length,crc:v.getUint32(offset+16,true)});offset+=46+nameSize+extra+comment;}
 async function entry(name:string){const info=entries.get(name);if(!info)throw Error('A required backup file is missing: '+name);const local=new Uint8Array(await file.slice(info.offset,info.offset+30).arrayBuffer()),h=new DataView(local.buffer);if(h.getUint32(0,true)!==0x04034b50||h.getUint16(8,true)!==0)throw Error('Backup file header is invalid.');const nameSize=h.getUint16(26,true),extra=h.getUint16(28,true),actualName=decoder.decode(await file.slice(info.offset+30,info.offset+30+nameSize).arrayBuffer());if(actualName!==name)throw Error('Backup file names disagree.');const from=info.offset+30+nameSize+extra;if(from+info.size>start)throw Error('Backup entry exceeds its directory.');const blob=file.slice(from,from+info.size),bytes=new Uint8Array(await blob.arrayBuffer());if(crc32(bytes)!==info.crc)throw Error('Backup checksum failed: '+name);return blob;}
 if((entries.get('manifest.json')?.size||0)>8*1024*1024)throw Error('Backup manifest exceeds 8 MB.');
 const manifest=JSON.parse(await (await entry('manifest.json')).text());return {manifest,entry,names:[...entries.keys()]};
}
export async function sha256(blob:Blob){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))).map(b=>b.toString(16).padStart(2,'0')).join('')}
export function downloadBlob(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000)}
