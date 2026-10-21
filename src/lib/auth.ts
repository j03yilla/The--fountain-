import "server-only";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import type {Role} from "./validation";
import { database } from "./db";
export const authOptions:NextAuthOptions={
 providers:[GitHubProvider({clientId:process.env.GITHUB_ID||"",clientSecret:process.env.GITHUB_SECRET||""})],
 session:{strategy:"jwt",maxAge:60*60*8},
 callbacks:{async jwt({token,account,profile}){
 if(account){
 if(!process.env.DATABASE_URL)throw new Error("Account provisioning is not configured.");
 const id=`github:${account.providerAccountId}`;
 const sql=neon(process.env.DATABASE_URL);
 const name=profile?.name||"Contributor";
 await sql`insert into profiles(id,name,slug) values(${id},${name},${"contributor-"+account.providerAccountId}) on conflict(id) do nothing`;
 token.sub=id;
 }return token;
 },async session({session,token}){if(session.user&&token.sub)session.user.id=token.sub;return session;}}
};
export async function actor(){
 const session=await getServerSession(authOptions);
 if(!session?.user?.id)return null;
 const id=session.user.id; const sql=database();
 const result=await sql.transaction([
 sql`select set_config('app.actor_id',${id},true)`,
 sql`select id,role,name from profiles where id=${id}`,
 ]);
 const row=result[1][0];return row?{id:row.id as string,role:row.role as Role,name:row.name as string}:null;
}
export async function requireActor(){const user=await actor();if(!user)redirect('/api/auth/signin');return user;}
export async function requireEditor(){const user=await requireActor();if(!['editor','administrator'].includes(user.role))redirect('/dashboard');return user;}
