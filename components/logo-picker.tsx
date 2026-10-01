"use client";
import {useState} from 'react';
export function Logo({value,name,className=''}:{value?:string;name:string;className?:string}){return value?<img className={'identity-logo '+className} src={value} alt={name+' logo'}/>:<span className={'identity-fallback '+className}>{name?.slice(0,1)||'C'}</span>}
export function LogoPicker({value,onChange,label}:{value?:string;onChange:(v:string)=>void;label:string}){
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function upload(file?:File){if(!file)return;setError('');setBusy(true);try{
 if(!['image/png','image/jpeg'].includes(file.type)||file.size>5*1024*1024)throw Error('Choose a PNG or JPG under 5 MB.');
 const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await img.decode();if(!img.width||!img.height)throw Error('This image cannot be read.');const canvas=document.createElement('canvas'),ratio=Math.min(1,256/img.width,256/img.height);canvas.width=Math.max(1,Math.round(img.width*ratio));canvas.height=Math.max(1,Math.round(img.height*ratio));canvas.getContext('2d')!.drawImage(img,0,0,canvas.width,canvas.height);const data=canvas.toDataURL('image/png');if(data.length>200000)throw Error('Please use a simpler or smaller logo.');onChange(data)}finally{URL.revokeObjectURL(url)}
 }catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 return <div className="wide logo-picker"><strong>{label}</strong><div><Logo value={value} name={label}/><label className="secondary">{busy?'Preparing…':'Upload logo'}<input disabled={busy} type="file" accept="image/png,image/jpeg" aria-label={'Upload '+label} onChange={e=>{upload(e.target.files?.[0]);e.target.value=''}}/></label>{value&&<button type="button" className="text-button" onClick={()=>onChange('')}>Remove</button>}</div><small>PNG or JPG. Saved with the profile when you save.</small>{error&&<p role="alert">{error}</p>}</div>
}
