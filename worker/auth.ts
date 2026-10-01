export type PersonalEnvironment={DASHBOARD_USERNAME?:string;DASHBOARD_PASSWORD?:string};
async function equalSecret(a:string,b:string){const digest=async(v:string)=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)));const [x,y]=await Promise.all([digest(a),digest(b)]);let difference=0;for(let i=0;i<x.length;i++)difference|=x[i]^y[i];return difference===0;}
export async function protect(request:Request,env:PersonalEnvironment):Promise<Response|null>{
 const password=env.DASHBOARD_PASSWORD;
 if(!password||password.length<16||password==='REPLACE_WITH_A_LONG_UNIQUE_PASSWORD')return new Response('Set a unique DASHBOARD_PASSWORD secret of at least 16 characters before opening this dashboard.',{status:503,headers:{'Cache-Control':'no-store'}});
 const authorization=request.headers.get('Authorization')||'';let username='',supplied='';
 try{if(authorization.startsWith('Basic ')){const decoded=atob(authorization.slice(6));const colon=decoded.indexOf(':');if(colon>=0){username=decoded.slice(0,colon);supplied=decoded.slice(colon+1)}}}catch{}
 if(!(await equalSecret(username,env.DASHBOARD_USERNAME||'owner'))||!(await equalSecret(supplied,password)))return new Response('Sign in to your personal Client Dashboard.',{status:401,headers:{'WWW-Authenticate':'Basic realm="Client Dashboard", charset="UTF-8"','Cache-Control':'no-store'}});
 if(!['GET','HEAD','OPTIONS'].includes(request.method)){const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return new Response('Cross-site writes are not allowed.',{status:403,headers:{'Cache-Control':'no-store'}});}
 return null;
}
