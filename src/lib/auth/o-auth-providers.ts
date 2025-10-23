import { DiscordIcon, GitHubIcon } from "@/components/auth/o-auth-icons";
import { ComponentProps, ElementType } from "react";

export const SUPPORTED_O_AUTH_PROVIDERS = ["github", "discord"];
export type SupportedOAuthProviders =
  (typeof SUPPORTED_O_AUTH_PROVIDERS)[number];

export const SUPPORTED_O_AUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProviders,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
> = {
  discord: { name: "Discord", Icon: DiscordIcon },
  github: { name: "GitHub", Icon: GitHubIcon },
};
