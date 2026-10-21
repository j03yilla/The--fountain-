import Link from 'next/link';
import {requireActor} from '@/lib/auth';
import {database,configured} from '@/lib/db';
import {transition} from './actions';
export const metadata={title:'Contributor dashboard',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default async function Dashboard(){
 if(!configured()||!process.env.GITHUB_ID)return <main id="main" className="section page"><p className="eyebrow">CONTRIBUTOR DESK</p><h1>Your next story<br/><em>starts here.</em></h1><p className="lede">Contributor access opens once sign-in and the Neon database are connected.</p><p>No account or manuscript data is stored until that setup is complete.</p><Link href="/about">About The Fountain ↗</Link></main>;
 const user=await requireActor();const sql=database();const result=await sql.transaction([sql`select set_config('app.actor_id',${user.id},true)`,sql`select id,title,state,content from works where author_id=${user.id} order by updated_at desc`]);
 return <main id="main" className="section page"><p className="eyebrow">CONTRIBUTOR DESK / {user.name}</p><h1>Your work, in progress.</h1><p><Link className="button" href="/dashboard/new">Start a submission ↗</Link> <Link href="/api/auth/signout">Sign out</Link></p>{user.role!=='contributor'&&<p><Link href="/editorial">Open the editorial desk ↗</Link></p>}<div className="dashboard-list">{result[1].map(w=><article key={w.id} className="dashboard-item"><span className="status">{w.state.replaceAll('_',' ')}</span><h2><Link href={`/dashboard/${w.id}`}>{w.title}</Link></h2>{['draft','changes_requested'].includes(w.state)&&<form action={transition}><input type="hidden" name="id" value={w.id}/><input type="hidden" name="state" value="submitted"/><button>Submit for review ↗</button></form>}</article>)}</div>{!result[1].length&&<p>Your saved drafts will appear here.</p>}</main>;
}
