import {notFound} from 'next/navigation';
import {configured,database} from '@/lib/db';
import {works} from '@/lib/content';
import {WorkCard} from '@/components/work-card';
export default async function Contributor({params}:{params:Promise<{slug:string}>}){if(!configured())notFound();const {slug}=await params;const sql=database();const rows=await sql`select name,bio from profiles where slug=${slug} and public=true`;const p=rows[0];if(!p)notFound();return <main id="main" className="section page"><p className="eyebrow">CONTRIBUTOR</p><h1>{p.name}</h1><p className="lede">{p.bio}</p><div className="work-grid">{(await works()).filter(w=>w.author_slug===slug).map(w=><WorkCard work={w} key={w.id}/>)}</div></main>;}
