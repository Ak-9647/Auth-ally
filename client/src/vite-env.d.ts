/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL?: string;
  readonly VITE_APP_AI_SERVICE_KEY?: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_CONVEX_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 