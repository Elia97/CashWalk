import { GoogleIcon } from '@/components/auth/o-auth-icons';
import { ComponentProps, ElementType } from 'react';

export const SUPPORTED_O_AUTH_PROVIDERS = ['google'];
export type SupportedOAuthProviders = (typeof SUPPORTED_O_AUTH_PROVIDERS)[number];

export const SUPPORTED_O_AUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProviders,
  { name: string; Icon: ElementType<ComponentProps<'svg'>> }
> = {
  google: { name: 'Google', Icon: GoogleIcon },
};
