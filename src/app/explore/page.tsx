import {works} from "@/lib/content";
import {WorkCard} from "@/components/work-card";
export const metadata={title:"Explore the archive"};
export default async function Explore({searchParams}:{searchParams:Promise<{q?:string;section?:string}>}) {
 const params=await searchParams; const q=(params.q||"").slice(0,150);const section=["words","art","culture"].includes(params.section||"")?params.section!:"";
 const items=await works(q,section);
 return <main id="main" className="section page"><p className="eyebrow">THE PUBLICATION</p><h1>Follow the current.</h1><p className="lede">Explore literature, visual art and culture.</p><form className="search-form"><label htmlFor="q">Search the archive</label><div className="input-row"><input id="q" name="q" defaultValue={q} placeholder="A title, a word, an idea…" maxLength={150}/><select name="section" aria-label="Section" defaultValue={section}><option value="">All sections</option><option value="words">Words</option><option value="art">Art</option><option value="culture">Culture</option></select><button>Search ↗</button></div></form><p className="eyebrow">{items.length} WORKS</p><div className="work-grid">{items.map(w=><WorkCard key={w.id} work={w}/>)}</div>{!items.length&&<div className="archive-note"><h2>{q?"No matching works yet.":"The archive is being preserved."}</h2><p>Visit the original publication while the verified collection is prepared.</p><a href="https://thefountainart.wixsite.com/fountain/blog-1">Browse the original archive ↗</a></div>}</main>;
}
