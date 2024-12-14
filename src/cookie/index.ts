import { CookieOptions } from '@/cookie/types';
import { IncomingMessage, ServerResponse } from 'http';
import { isDate } from '@/tools';

export class CookieManager {
  public request!: IncomingMessage;
  public response!: ServerResponse;
  public cookies: object = {};

  constructor(request, response) {
    this.request = request;
    this.response = response;

    this.parseCookies(request.headers.cookie);
  }

  /**
   * Parse the "Cookie" header from the request and store cookies as an object.
   * @param {string} cookieHeader - The "Cookie" header string from the request.
   */
  parseCookies(cookieHeader: string): void {
    if (!cookieHeader) return;
    cookieHeader.split(';').forEach((cookie) => {
      const [key, value] = cookie.split('=').map((part) => part.trim());
      if (key) this.cookies[key] = decodeURIComponent(value || '');
    });
  }

  /**
   * Get a cookie by name.
   * @param {string} name - The name of the cookie.
   * @returns {string|undefined} The value of the cookie, or undefined if not found.
   */
  get(name): string | undefined {
    return this.cookies[name];
  }

  /**
   * Set a cookie with options.
   * @param {string} name - The name of the cookie.
   * @param {string} value - The value of the cookie.
   * @param {object} [options] - Optional cookie settings (e.g., maxAge, domain, path).
   * @returns {string} The formatted "Set-Cookie" string.
   */
  set(name: string, value: string, options: CookieOptions = {}): void {
    const cookieParts = [`${name}=${encodeURIComponent(value)}`];
    if (options.maxAge) cookieParts.push(`Max-Age=${options.maxAge}`);
    if (options.domain) cookieParts.push(`Domain=${options.domain}`);
    if (options.path) cookieParts.push(`Path=${options.path}`);
    if (options.expires && isDate(options.expires)) cookieParts.push(`Expires=${options.expires.toUTCString()}`);
    if (options.httpOnly) cookieParts.push('HttpOnly');
    if (options.secure) cookieParts.push('Secure');
    if (options.sameSite) cookieParts.push(`SameSite=${options.sameSite}`);
    const cookieString = cookieParts.join('; ');
    this.cookies[name] = value;
    const oldCookie = this.response.getHeader('Set-Cookie');
    if (!oldCookie) {
      this.response.setHeader('Set-Cookie', [cookieString]);
    } else if (typeof oldCookie === 'object') {
      this.response.setHeader('Set-Cookie', [...oldCookie, cookieString]);
    }
  }

  /**
   * Delete a cookie by name.
   * @param {string} name - The name of the cookie.
   * @param {object} [options] - Optional cookie settings (e.g., domain, path).
   * @returns {string} The formatted "Set-Cookie" string for deletion.
   */
  delete(name: string, options: CookieOptions = {}): void {
    this.set(name, '', { ...options, maxAge: 0 });
  }
}
