import fs from 'node:fs';
const values={};for(let i=2;i<process.argv.length;i+=2){if(!process.argv[i].startsWith('--')||!process.argv[i+1])throw Error('Use --url URL --database-id UUID [--worker NAME] [--database-name NAME] [--bucket NAME]');values[process.argv[i].slice(2)]=process.argv[i+1]}
const url=new URL(values.url);if(url.protocol!=='https:'||url.pathname!=='/'||url.search||url.hash)throw Error('Use your HTTPS website origin only.');
if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(values['database-id']||''))throw Error('Provide the D1 database_id returned by Cloudflare.');
const config=JSON.parse(fs.readFileSync('wrangler.jsonc','utf8'));config.d1_databases[0].database_id=values['database-id'];
for(const name of ['worker','database-name','bucket'])if(values[name]&&!/^[a-z][a-z0-9-]{0,62}$/.test(values[name]))throw Error('Resource names must contain lowercase letters, digits and hyphens.');
if(values.worker)config.name=values.worker;if(values['database-name'])config.d1_databases[0].database_name=values['database-name'];if(values.bucket)config.r2_buckets[0].bucket_name=values.bucket;
fs.writeFileSync('wrangler.jsonc',JSON.stringify(config,null,2)+'\n');fs.writeFileSync('config/app.json',JSON.stringify({siteUrl:url.origin},null,2)+'\n');await import('./prepare-downloads.mjs');console.log('Configured your dashboard URL, database binding and desktop packages.');
