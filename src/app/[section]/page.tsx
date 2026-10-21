import {notFound} from "next/navigation";
import {works} from "@/lib/content";
import {WorkCard} from "@/components/work-card";
const labels:Record<string,[string,string]>={words:["Words","Poetry, fiction, essays. Find a world between the lines."],art:["Art","Visual stories and new ways of seeing."],culture:["Culture","Conversations, ideas and creative expression."]};
export function generateStaticParams(){return Object.keys(labels).map(section=>({section}));}
export async function generateMetadata({params}:{params:Promise<{section:string}>}) { const {section}=await params;return {title:labels[section]?.[0]||"Not found"}; }
export default async function Section({params}:{params:Promise<{section:string}>}) {const {section}=await params;const label=labels[section];if(!label)notFound();const items=await works("",section);return <main id="main" className="section page"><p className="eyebrow">THE FOUNTAIN / {label[0]}</p><h1>{label[0]}</h1><p className="lede">{label[1]}</p><div className="work-grid">{items.map(w=><WorkCard key={w.id} work={w}/>)}</div>{!items.length&&<div className="archive-note"><h2>A space for new perspectives.</h2><p>Verified work will appear here after editorial review.</p><a href="/dashboard">Contribute to The Fountain ↗</a></div>}</main>;}
