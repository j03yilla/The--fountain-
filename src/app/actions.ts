"use server";
import { createHash, randomBytes } from "node:crypto";
import { database, configured } from "@/lib/db";
import { newsletterSchema } from "@/lib/validation";
export async function subscribe(_:string,form:FormData):Promise<string> {
 const parsed=newsletterSchema.safeParse(Object.fromEntries(form));
 if (!parsed.success) return "Enter a valid email and confirm your consent.";
 if (!configured()) return "Newsletter registration is not available yet. Please try again after launch.";
 try {
 const sql=database();
 const token=createHash("sha256").update(randomBytes(32)).digest("hex");
 await sql`insert into newsletter_subscribers(email,unsubscribe_hash) values (${parsed.data.email.toLowerCase()},${token}) on conflict(email) do nothing`;
 return "Thank you. Your subscription request has been recorded.";
 } catch { return "We could not record your subscription. Please try again."; }
}
