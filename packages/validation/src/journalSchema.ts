import { z } from "zod";

export const CreateJournalEntrySchema = z.object({
  title: z.string().max(200).optional(),
  rawContent: z.string().min(1, "Brain dump content cannot be empty").max(20000),
  moodBefore: z.number().int().min(1).max(10).optional().nullable(),
  distressTags: z.array(z.string()).default([]),
});

export const ReframeJournalEntrySchema = z.object({
  rawContent: z.string().min(5, "Please share a few thoughts to reframe").max(20000),
  moodBefore: z.number().int().min(1).max(10).optional().nullable(),
  distressTags: z.array(z.string()).optional(),
});

export const UpdatePostOffloadSchema = z.object({
  id: z.string().cuid(),
  moodAfter: z.number().int().min(1).max(10).optional().nullable(),
  actionTaken: z.enum(["reframed", "released", "saved"]).optional().nullable(),
  reframingResult: z.any().optional().nullable(),
});

export type CreateJournalEntryInput = z.infer<typeof CreateJournalEntrySchema>;
export type ReframeJournalEntryInput = z.infer<typeof ReframeJournalEntrySchema>;
export type UpdatePostOffloadInput = z.infer<typeof UpdatePostOffloadSchema>;
