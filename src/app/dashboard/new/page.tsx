import {requireActor} from '@/lib/auth';
import {SubmissionForm} from '@/components/submission-form';
export const metadata={title:'New submission',robots:{index:false,follow:false}};
export default async function New(){await requireActor();return <main id="main" className="section page"><p className="eyebrow">CONTRIBUTOR DESK</p><h1>Let something flow.</h1><p className="lede">Share an original work with The Fountain.</p><SubmissionForm/></main>;}
