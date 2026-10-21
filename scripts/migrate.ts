import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';
if(!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL to the Neon owner connection.');
const sql=neon(process.env.DATABASE_URL);
await sql.query(await readFile(new URL('../db/migrations/001_initial.sql',import.meta.url),'utf8'));
console.log('Initial schema applied. Create the runtime role and grants before starting the app.');
