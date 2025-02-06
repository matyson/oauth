import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    KEYCLOAK_BASE_URL: z.string().url(),
    KEYCLOAK_REALM: z.string(),
    KEYCLOAK_CLIENT_ID: z.string(),
    KEYCLOAK_CLIENT_SECRET: z.string(),
  },
  clientPrefix: "PUBLIC_",
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
