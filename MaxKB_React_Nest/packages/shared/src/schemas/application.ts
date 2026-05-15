import { z } from "zod";

export const createApplicationSchema = z.object({
	name: z.string().min(1, "Application name is required"),
	description: z.string().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
