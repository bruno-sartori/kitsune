declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      DB_HOST: string;
      DB_PORT: string;
      RUST_BACKTRACE: string;
      OAUTH2_CLIENT_ID: string;
      OAUTH2_CLIENT_SECRET: string;
      API_TYPE: 'server' | 'client';
    }
  }
}

export {};
