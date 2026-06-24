import z from "zod";

export const CreateFunnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
});
export const QuestionCategorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const PageSchema = z.object({
  title: z.string().min(1),
  pathName: z.string().optional(),
});
