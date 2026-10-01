import fs from 'node:fs';
const config=JSON.parse(fs.readFileSync('wrangler.jsonc','utf8'));
const app=JSON.parse(fs.readFileSync('config/app.json','utf8'));
if(config.d1_databases[0].database_id==='00000000-0000-4000-8000-000000000000'||app.siteUrl.includes('your-dashboard.example.com')){
 console.error('Configure your real database ID and website URL first. Read START-HERE.md.');process.exit(1);
}
if(!config.assets?.run_worker_first){console.error('Authentication requires assets.run_worker_first=true.');process.exit(1)}
