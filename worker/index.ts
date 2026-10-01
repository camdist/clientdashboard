import handler from 'vinext/server/fetch-handler';
import {protect} from './auth';
export default {async fetch(request:Request,env:Cloudflare.Env,ctx:ExecutionContext){
 const denied=await protect(request,env);if(denied)return denied;
 // run_worker_first protects static assets too. Serve them from the asset
 // binding after authentication instead of passing them to the app router.
 const pathname=new URL(request.url).pathname;
 const staticAsset=pathname.startsWith('/_next/static/')||pathname.startsWith('/icons/')||pathname.startsWith('/themes/')||pathname.startsWith('/downloads/')||['/favicon.svg','/manifest.webmanifest','/sw.js'].includes(pathname);
 const response=staticAsset&&['GET','HEAD'].includes(request.method)
  ? env.ASSETS?await env.ASSETS.fetch(request):new Response('Static asset binding is unavailable.',{status:503})
  : await handler.fetch(request,env,ctx);
 const headers=new Headers(response.headers);
 headers.set('Cache-Control','private, no-store');headers.set('X-Content-Type-Options','nosniff');
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}};
