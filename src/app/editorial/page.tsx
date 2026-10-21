import Link from 'next/link';
import {requireEditor} from '@/lib/auth';
import {database,configured} from '@/lib/db';
import {transition,addReview} from '@/app/dashboard/actions';
export const metadata={title:'Editorial dashboard',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default async function Editorial(){if(!configured())return <main id="main" className="section page"><h1>Editorial desk</h1><p>Editorial access requires a configured database and an editor account.</p></main>;
 const user=await requireEditor();const sql=database();const r=await sql.transaction([sql`select set_config('app.actor_id',${user.id},true)`,sql`select id,title,state,excerpt from works where state <> 'draft' order by updated_at desc`]);
 const options:Record<string,string[]>={submitted:['changes_requested','accepted','rejected'],accepted:['published','changes_requested'],published:['accepted']};
 return <main id="main" className="section page"><p className="eyebrow">EDITORIAL DESK</p><h1>Shape the next current.</h1><p className="lede">Review submissions, leave feedback and publish accepted work.</p><div className="dashboard-list">{r[1].map(w=><article className="dashboard-item" key={w.id}><span className="status">{w.state}</span><h2><Link href={`/dashboard/${w.id}`}>{w.title}</Link></h2><p>{w.excerpt}</p><form action={transition} className="input-row"><input type="hidden" name="id" value={w.id}/><select name="state" aria-label="Editorial decision">{(options[w.state]||[]).map(x=><option value={x} key={x}>{x.replaceAll('_',' ')}</option>)}</select>{options[w.state]?.length>0&&<button>Apply decision</button>}</form><form action={addReview} className="form-stack"><input type="hidden" name="id" value={w.id}/><label>Feedback<textarea name="note" required maxLength={5000} style={{minHeight:90}}/></label><button>Add editorial note</button></form></article>)}</div></main>;}
