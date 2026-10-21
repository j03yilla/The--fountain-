"use client";
import { useActionState } from "react";
import { subscribe } from "@/app/actions";
export function Newsletter() {
 const [message, action, pending] = useActionState(subscribe, "");
 return <form action={action} className="newsletter-form"><label htmlFor="email">Email address</label><div className="input-row"><input id="email" name="email" type="email" required autoComplete="email" placeholder="Your email address" maxLength={254}/><button disabled={pending}>{pending ? "Joining…" : "Subscribe ↗"}</button></div><label className="consent"><input type="checkbox" name="consent" value="yes" required/> I agree to receive The Fountain newsletter. I can unsubscribe at any time.</label><p role="status">{message}</p></form>;
}
