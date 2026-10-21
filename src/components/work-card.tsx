import Link from "next/link";
import type { Work } from "@/lib/content";
export function WorkCard({ work }: {work: Work}) {
 return <article className="work-card">{work.cover_url && <img src={work.cover_url} alt="" loading="lazy" className="work-cover" />}<p className="eyebrow">{work.format.replace("-", " ")}</p><h3><Link href={`/read/${work.slug}`}>{work.title}</Link></h3><p>{work.excerpt}</p><p className="byline">{work.author_name} <span>·</span> {new Date(work.published_at).toLocaleDateString("en-GB",{month:"short",year:"numeric",timeZone:"UTC"})}</p></article>;
}
