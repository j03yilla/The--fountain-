import type {MetadataRoute} from "next";
import {works} from "@/lib/content";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";return [...["","/explore","/words","/art","/culture","/contributors","/editions","/about"].map(p=>({url:base+p})),...(await works()).map(w=>({url:`${base}/read/${w.slug}`,lastModified:new Date(w.published_at)}))];}
