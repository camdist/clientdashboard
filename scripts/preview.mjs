import fs from 'node:fs';
import {spawn} from 'node:child_process';
if(!fs.existsSync('dist/server/wrangler.json'))throw Error('Run pnpm build before preview.');
if(!fs.existsSync('.dev.vars'))throw Error('Copy .dev.vars.example to .dev.vars and set a development-only password.');
fs.copyFileSync('.dev.vars','dist/server/.dev.vars');
const child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--config','dist/server/wrangler.json','--local','--persist-to','.wrangler/state',...process.argv.slice(2)],{stdio:'inherit'});
child.on('exit',code=>{fs.rmSync('dist/server/.dev.vars',{force:true});process.exitCode=code||0});
process.on('SIGINT',()=>child.kill('SIGINT'));process.on('SIGTERM',()=>child.kill('SIGTERM'));
