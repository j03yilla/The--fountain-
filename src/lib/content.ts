import "server-only";
import { database, configured } from "./db";
export type Work = {id:string;slug:string;title:string;excerpt:string;section:string;format:string;content:string;author_name:string;author_slug:string;published_at:string;cover_url:string|null};
export async function works(query = "", section = ""): Promise<Work[]> {
 if (!configured()) return [];
 const sql = database();
 return await sql`select w.id,w.slug,w.title,w.excerpt,w.section,w.format,w.content,w.published_at,w.cover_url,p.name as author_name,p.slug as author_slug from works w join profiles p on p.id=w.author_id where w.state='published' and (${section}='' or w.section=${section}) and (${query}='' or w.search @@ websearch_to_tsquery('english',${query}) or w.title ilike ${"%"+query+"%"}) order by w.published_at desc limit 100` as Work[];
}
export async function work(slug: string) {
 if (!configured()) return null;
 const sql=database();
 const rows=await sql`select w.*,p.name as author_name,p.slug as author_slug from works w join profiles p on p.id=w.author_id where w.slug=${slug} and w.state='published'`;
 return (rows[0] as Work|undefined) ?? null;
}
