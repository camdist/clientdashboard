import fs from 'node:fs';
const app=JSON.parse(fs.readFileSync('config/app.json','utf8'));const origin=new URL(app.siteUrl).origin;
const themes=JSON.parse(fs.readFileSync('lib/theme-catalog.json','utf8')).map(t=>[t.id,t.name]);
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0}
function zip(entries,file){const parts=[],central=[];let offset=0;for(const [name,text] of entries){const n=Buffer.from(name),data=Buffer.from(text),crc=crc32(data),h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt32LE(crc,14);h.writeUInt32LE(data.length,18);h.writeUInt32LE(data.length,22);h.writeUInt16LE(n.length,26);parts.push(h,n,data);const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt32LE(crc,16);c.writeUInt32LE(data.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);central.push(c,n);offset+=h.length+n.length+data.length;}const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);fs.writeFileSync(file,Buffer.concat([...parts,directory,end]));}
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const shortcuts=(folder,url)=>[[folder+'Client Dashboard.url','[InternetShortcut]\r\nURL='+url+'\r\n'],[folder+'Client Dashboard.webloc','<?xml version="1.0" encoding="UTF-8"?><plist version="1.0"><dict><key>URL</key><string>'+escape(url)+'</string></dict></plist>']];
const note='CLIENT DASHBOARD — PERSONAL DESKTOP ACCESS\n\nExtract the ZIP and move the Windows .url or Mac .webloc file to your desktop.\nInternet access and your personal dashboard username/password are required.\nThese open the same online workspace; they are not offline executables.\nWebsite: '+origin+'\n';
fs.mkdirSync('public/downloads',{recursive:true});zip([['README.txt',note],...shortcuts('',origin+'/')],'public/downloads/Client-Dashboard-Desktop.zip');
zip([['START-HERE.txt',note],...themes.flatMap(([id,name])=>[...shortcuts(name.replaceAll(' ','-')+'/',origin+'/?theme='+id),[name.replaceAll(' ','-')+'/theme.json',JSON.stringify({theme:id,name,previewUrl:origin+'/?theme='+id},null,2)]])],'public/downloads/Client-Dashboard-Themes.zip');

// Retain the previous download URL for existing desktop bookmarks.
fs.copyFileSync('public/downloads/Client-Dashboard-Themes.zip','public/downloads/Client-Dashboard-Buyer-Themes.zip');

// Buyer-facing help follows the release source, so deployed downloads stay current.
for(const name of ['BUYER-START-HERE.md','RELEASE-v3.6.md'])fs.copyFileSync(name,'public/downloads/'+name);
