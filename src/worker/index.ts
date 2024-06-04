// childProcess.js
import { SendHandle, Serializable, fork } from 'child_process';
import { isAbsolute, join } from 'path';

export function createChild(path: string,
  options?: {
    listener?: (message: Serializable, sendHandle: SendHandle) => void,
    keepAlive?: boolean,
  }) {

  if (!isAbsolute(path)) path = join(__dirname, path);
  console.log(__dirname)
  const child = fork(path, { env: process.env });
  // parent got message from child
  if (!!options?.listener?.call) child.on('message', options?.listener);

  child.on('close', (code) => {
    if (!!options?.keepAlive) createChild(path, options)
  });
  return child;
}
