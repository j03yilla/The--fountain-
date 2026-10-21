"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="section page"><p className="eyebrow">A PAUSE IN THE FLOW</p><h1>We couldn’t load this page.</h1><p>Please try again in a moment.</p><button onClick={reset}>Try again</button></main>;}
