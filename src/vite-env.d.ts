/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base do painel admin (adom-admin), ex: http://localhost:3000 ou https://adom-admin.vercel.app */
  readonly VITE_ADMIN_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
