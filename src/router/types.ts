import { IncomingMessage } from 'http';

export interface RouterRequest extends IncomingMessage {
  query?: object | null;
  params?: object | null;
  payload?: object | null;
  body?: any;
  file?: any;
}
