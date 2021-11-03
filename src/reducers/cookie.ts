export class Cookie {
    static get(name: string | number | boolean | any[]) {
        // @ts-ignore
        const cookieName = `${encodeURIComponent(name)}=`;
        const cookie = document.cookie;
        let value = null;

        const startIndex = cookie.indexOf(cookieName);
        if (startIndex > -1) {
            let endIndex = cookie.indexOf(';', startIndex);
            if (endIndex=== -1) {
                // @ts-ignore
                endIndex = cookie.length;
            }
            // @ts-ignore
            const x = cookie.substring(startIndex + name.length + 1, endIndex);
            value = decodeURIComponent(x);
        }
        return value;
    }

    static set(name: string | number | boolean, value: string | number | boolean, expires: Date, path ?: any, domain ?: any, secure ?: any) {

        let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        cookieText += `; expires=${expires.toUTCString()}`;

        if (path) cookieText += `; path=${path}`;
        if (domain) cookieText += `; domain=${domain}`;
        if (secure) cookieText += `; secure`;

        document.cookie = cookieText;
    }

    static remove(name: string | number | boolean, path ?: any, domain ?: any, secure ?: any) {
        Cookie.set(name, "", new Date(0), path, domain, secure);
    }
}
