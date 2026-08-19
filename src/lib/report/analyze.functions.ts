import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { analyzeSite } from "./analyze.server";

export const runAnalysis = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ url: z.string().url() }).parse(data))
  .handler(async ({ data }) => analyzeSite(data.url));
