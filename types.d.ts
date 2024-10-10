declare namespace Express {
  export interface Request {
    user: any;
  }
  export interface Response {
    user: any;
  }
}

declare module 'lib.node' {
  export function hello(): string;
}
