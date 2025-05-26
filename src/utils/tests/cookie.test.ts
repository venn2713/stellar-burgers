import { getCookie, setCookie, deleteCookie } from '../cookie';

describe('cookie utils', () => {
  let originalCookie: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalCookie = Object.getOwnPropertyDescriptor(document, 'cookie');
    let cookieStore = '';
    Object.defineProperty(document, 'cookie', {
      get: () => cookieStore,
      set: (val: string) => {
        const [pair] = val.split(';');
        const [key, value] = pair.split('=');
        const cookies = cookieStore
          .split('; ')
          .filter(Boolean)
          .reduce<Record<string, string>>((acc, c) => {
            const [k, v] = c.split('=');
            acc[k] = v;
            return acc;
          }, {});
        cookies[key] = value;
        cookieStore = Object.entries(cookies)
          .map(([k, v]) => `${k}=${v}`)
          .join('; ');
      },
      configurable: true
    });
    document.cookie = '';
  });

  afterEach(() => {
    if (originalCookie) {
      Object.defineProperty(document, 'cookie', originalCookie);
    }
  });

  it('setCookie устанавливает cookie', () => {
    setCookie('foo', 'bar');
    expect(document.cookie).toContain('foo=bar');
  });

  it('getCookie возвращает значение cookie', () => {
    document.cookie = 'test1=abc';
    expect(getCookie('test1')).toBe('abc');
  });

  it('getCookie возвращает undefined если cookie нет', () => {
    document.cookie = '';
    expect(getCookie('notfound')).toBeUndefined();
  });

  it('setCookie с expires', () => {
    setCookie('exp', 'val', { expires: 1 });
    expect(document.cookie).toContain('exp=val');
  });

  it('setCookie с boolean prop', () => {
    setCookie('bool', 'yes', { secure: true });
    expect(document.cookie).toContain('bool=yes');
  });

  it('deleteCookie удаляет cookie', () => {
    setCookie('del', 'gone');
    deleteCookie('del');
    expect(getCookie('del')).toBe('');
  });

  it('setCookie encodes value', () => {
    setCookie('enc', 'a b&c');
    expect(document.cookie).toContain('enc=a%20b%26c');
    expect(getCookie('enc')).toBe('a b&c');
  });
});
