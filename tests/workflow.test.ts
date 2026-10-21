import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mayTransition,submissionSchema,newsletterSchema} from '../src/lib/validation';
test('contributors submit but cannot accept, publish or reopen rejected work',()=>{
 assert.equal(mayTransition('contributor','draft','submitted'),true);
 assert.equal(mayTransition('contributor','changes_requested','submitted'),true);
 assert.equal(mayTransition('contributor','submitted','accepted'),false);
 assert.equal(mayTransition('contributor','accepted','published'),false);
 assert.equal(mayTransition('contributor','rejected','submitted'),false);
});
test('editors must review before publishing',()=>{
 assert.equal(mayTransition('editor','draft','published'),false);
 assert.equal(mayTransition('editor','submitted','accepted'),true);
 assert.equal(mayTransition('editor','accepted','published'),true);
 assert.equal(mayTransition('editor','published','accepted'),true);
});
test('submission bounds and newsletter consent are enforced',()=>{
 assert.equal(submissionSchema.safeParse({title:'a',excerpt:'',section:'words',format:'poem',content:'a'}).success,true);
 assert.equal(submissionSchema.safeParse({title:'',excerpt:'',section:'words',format:'poem',content:'a'}).success,false);
 assert.equal(newsletterSchema.safeParse({email:'reader@example.com',consent:'yes'}).success,true);
 assert.equal(newsletterSchema.safeParse({email:'reader@example.com'}).success,false);
});
