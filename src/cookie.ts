export class CookieError extends Error {}

const daysToMillis = 24 * 60 * 60 * 1000; // tslint:disable-line:no-magic-numbers

export interface ICookieOptions {
    readonly silent?: boolean;
    readonly days?: number;
    readonly secure?: boolean;
    readonly path?: string;
    readonly domain?: string;
}

const checkCookieSupport = (opts?: ICookieOptions): boolean => {
    if (typeof document === 'undefined' && (!opts || !opts.silent)) {
        throw new CookieError('Document is not defined! Are you trying to use this on the server?');
    }
    return typeof document !== 'undefined';
};

/**
 * 写入函数 设置cookie
 * @param write
 * 返回值为bool值 成功和失败
 * @param boolean 
 * @param name,value,opts
 */
const write = (name: string, value: string, opts?: ICookieOptions): boolean => {
    if (checkCookieSupport(opts)) {
        const date = new Date();
        const expires =
            !!opts && !!opts.days ? `; expires=${date.setTime(date.getTime() + opts.days * daysToMillis)}` : '';
        const secure = !!opts && opts.secure ? '; secure' : '';
        const path = !!opts && opts.path ? `; path=${opts.path}` : '';
        const domain = !!opts && opts.domain ? `; domain=${opts.domain}` : '';
        document.cookie = `${encodeURIComponent(name)}=${value}${expires}${secure}${path}${domain}`;
        return true;
    }
    return false;
};

const cookies = {
    get: (name: string, opts?: ICookieOptions): string | null => {
        if (checkCookieSupport(opts)) {
            const res = document.cookie.match(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`);
            return res ? res[1] : '';
        }
        return '';
    },
    set: write,
    remove: (name: string, opts?: ICookieOptions): boolean => write(name, '', Object.assign({ days: -1 }, opts)),
};

export default cookies;