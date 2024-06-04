export { };
declare module 'express-session' {
  interface SessionData { connections: Array<string> | undefined, ip: string }
}