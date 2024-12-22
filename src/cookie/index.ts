import { CookieOptions } from '@/cookie/types';
import { IncomingMessage, ServerResponse } from 'http';

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
  get(name: string): string | undefined {
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
    const def = {
      path: '/',
      domain: null,
      expires: new Date(2999, 1, 1).toUTCString(),
      httpOnly: true,
      secure: true,
      maxAge: 100 * 365 * 24 * 60 * 60 * 1000,
      sameSite: 'Lax'
    };
    const _opts = { ...def, ...options };
    const cookieParts = [`${name}=${encodeURIComponent(value)}`];
    if (_opts.maxAge) cookieParts.push(`Max-Age=${_opts.maxAge}`);
    if (_opts.domain) cookieParts.push(`Domain=${_opts.domain}`);
    if (_opts.path) cookieParts.push(`Path=${_opts.path}`);
    if (_opts.expires) cookieParts.push(`Expires=${_opts.expires}`);
    if (_opts.httpOnly) cookieParts.push('HttpOnly');
    if (_opts.secure) cookieParts.push('Secure');
    if (_opts.sameSite) cookieParts.push(`SameSite=${_opts.sameSite}`);
    const cookieString = cookieParts.join('; ');
    this.cookies[name] = value;
    this.response.setHeader('Set-Cookie', cookieString);
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
