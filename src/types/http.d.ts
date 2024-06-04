import { IncomingMessage } from "http";
import { Types } from "mongoose";
export { }

declare module 'http' {
  export interface IncomingMessage {
    connections: Array<string> | undefined
  }
}