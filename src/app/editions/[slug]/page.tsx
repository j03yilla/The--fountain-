import {notFound} from 'next/navigation';
import {configured,database} from '@/lib/db';
import {works} from '@/lib/content';
import {WorkCard} from '@/components/work-card';
export default async function Edition({params}:{params:Promise<{slug:string}>}){if(!configured())notFound();const sql=database();const {slug}=await params;const rows=await sql`select id,title,description from editions where slug=${slug} and published=true`;const e=rows[0];if(!e)notFound();const members=await sql`select work_id,position from edition_works where edition_id=${e.id} order by position`;const all=await works();return <main id="main" className="section page"><p className="eyebrow">A FOUNTAIN EDITION</p><h1>{e.title}</h1><p className="lede">{e.description}</p><div className="work-grid">{members.map(m=>all.find(w=>w.id===m.work_id)).filter(w=>!!w).map(w=><WorkCard work={w} key={w.id}/>)}</div></main>;}
