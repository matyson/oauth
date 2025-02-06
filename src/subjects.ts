import { createSubjects } from "@openauthjs/openauth/subject";
import { z } from "zod";

export const subjects = createSubjects({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    username: z.string(),
  }),
});
