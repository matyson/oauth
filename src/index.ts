import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { subjects } from "./subjects";
import { KeycloakProvider } from "@openauthjs/openauth/provider/keycloak";
import { env } from "./env";

console.log(env);

type KeycloakPayload = {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  sid: string;
  acr: string;
  "allowed-origins": string[];
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: {
      roles: string[];
    };
  };
  scope: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

export default issuer({
  subjects,
  storage: MemoryStorage(),
  providers: {
    keycloak: KeycloakProvider({
      baseUrl: env.KEYCLOAK_BASE_URL,
      realm: env.KEYCLOAK_REALM,
      clientID: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_CLIENT_SECRET,
      scopes: ["profile", "email"],
    }),
  },
  success: async (ctx, value) => {
    if (value.provider === "keycloak") {
      console.log(value.tokenset.access);
      const jwt = value.tokenset.access;
      const payload = jwt.split(".")[1];
      const decoded = Buffer.from(payload, "base64").toString("utf-8");
      const json = JSON.parse(decoded) as KeycloakPayload;
      console.log(json);
      return ctx.subject("user", {
        id: json.sub,
        email: json.email,
        name: json.name,
        username: json.preferred_username,
      });
    }
    throw new Error("Invalid provider");
  },
});
