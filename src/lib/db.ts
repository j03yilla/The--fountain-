import "server-only";
import { neon } from "@neondatabase/serverless";
export function database() {
 const url = process.env.DATABASE_RUNTIME_URL;
 if (!url) throw new Error("Neon runtime connection has not been configured.");
 return neon(url);
}
export const configured = () => Boolean(process.env.DATABASE_RUNTIME_URL);
