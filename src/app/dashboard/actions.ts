"use server";
import {randomUUID} from 'node:crypto';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {requireActor,requireEditor} from '@/lib/auth';
import {database} from '@/lib/db';
import {submissionSchema,mayTransition,type State} from '@/lib/validation';
export async function saveSubmission(_:string,form:FormData):Promise<string>{
 const user=await requireActor();const parsed=submissionSchema.safeParse(Object.fromEntries(form));
 if(!parsed.success)return parsed.error.issues[0].message;
 const data=parsed.data;const sql=database();const id=randomUUID();
 const slug=data.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'work';
 try{
 await sql.transaction([
 sql`select set_config('app.actor_id',${user.id},true)`,
 sql`insert into works(id,author_id,title,slug,excerpt,section,format,content) values(${id},${user.id},${data.title},${slug+'-'+id.slice(0,8)},${data.excerpt},${data.section},${data.format},${data.content})`,
 ]);
 }catch{return 'Your draft could not be saved. Please try again.';}
 revalidatePath('/dashboard');redirect('/dashboard');
}
export async function transition(form:FormData){
 const user=await requireActor();const sql=database();const id=String(form.get('id')||'');const to=String(form.get('state')||'') as State;
 if(!/^[0-9a-f-]{36}$/.test(id))throw new Error('Invalid manuscript.');
 const results=await sql.transaction([sql`select set_config('app.actor_id',${user.id},true)`,sql`select state,author_id from works where id=${id}`]);
 const w=results[1][0];if(!w||!mayTransition(user.role,w.state,to)||(user.role==='contributor'&&w.author_id!==user.id))throw new Error('This action is not permitted.');
 await sql.transaction([sql`select set_config('app.actor_id',${user.id},true)`,sql`update works set state=${to}::editorial_state,published_at=case when ${to}='published' then coalesce(published_at,now()) else published_at end where id=${id} and state=${w.state}::editorial_state`]);
 revalidatePath('/dashboard');revalidatePath('/editorial');revalidatePath('/');revalidatePath('/explore');
}
export async function addReview(form:FormData){
 const user=await requireEditor();const note=String(form.get('note')||'').trim();const id=String(form.get('id')||'');
 if(!note||note.length>5000||!/^[0-9a-f-]{36}$/.test(id))throw new Error('Invalid review.');
 const sql=database();await sql.transaction([sql`select set_config('app.actor_id',${user.id},true)`,sql`insert into reviews(work_id,editor_id,note) values(${id},${user.id},${note})`]);revalidatePath('/editorial');revalidatePath('/dashboard');
}
