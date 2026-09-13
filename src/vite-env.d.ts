/// <reference types="vite/client" />

face ImportMetaEnv {
  readonly VITE_API_ORIGIN: string
}

face ImportMeta {
  readonly env: ImportMetaEnv
}