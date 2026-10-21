import { z } from "zod";
export const formats = ["poem", "essay", "fiction", "interview", "visual-art"] as const;
export const sections = ["words", "art", "culture"] as const;
export const submissionSchema = z.object({
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().max(400),
  section: z.enum(sections),
  format: z.enum(formats),
  content: z.string().min(1).max(150000),
});
export type SubmissionInput = z.infer<typeof submissionSchema>;
export const newsletterSchema = z.object({email:z.email().max(254), consent:z.literal("yes")});
export type Role = "contributor" | "editor" | "administrator";
export type State = "draft" | "submitted" | "changes_requested" | "accepted" | "published" | "rejected";
const transitions: Record<State, readonly State[]> = {
 draft:["submitted"], submitted:["changes_requested","accepted","rejected"],
 changes_requested:["submitted"], accepted:["published","changes_requested"], published:["accepted"], rejected:[],
};
export function mayTransition(role: Role, from: State, to: State) {
 return transitions[from].includes(to) && (role !== "contributor" || (["draft","changes_requested"].includes(from) && to === "submitted"));
}
