import fs from 'fs';
// Credentials come from ../.env (see .env.example) or the process environment.
const envFile = new URL('../.env', import.meta.url);
const fileEnv = fs.existsSync(envFile) ? Object.fromEntries(fs.readFileSync(envFile, 'utf8').split(/\r?\n/).filter(l => /^[A-Z_]+=/.test(l)).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')]; })) : {};
const env = { ...fileEnv, ...process.env };
export const ENV = env;
const auth = 'Basic ' + Buffer.from(`${env.DATAFORSEO_LOGIN}:${env.DATAFORSEO_PASSWORD}`).toString('base64');
export let spent = 0;
export async function post(path, task, tries=3) {
  for (let a=0;a<tries;a++){
    try{
      const r = await fetch('https://api.dataforseo.com/v3'+path,{method:'POST',headers:{Authorization:auth,'Content-Type':'application/json'},body:JSON.stringify([task]),signal:AbortSignal.timeout(180000)});
      const j = await r.json();
      spent += j.cost||0;
      const t = j.tasks?.[0];
      if (t && t.status_code===20000) return t;
      if (a===tries-1) return t || j;
    }catch(e){ if(a===tries-1) return {error:String(e)}; }
    await new Promise(r=>setTimeout(r,3000*(a+1)));
  }
}
export async function get(path){
  const r = await fetch('https://api.dataforseo.com/v3'+path,{headers:{Authorization:auth}});
  return r.json();
}
