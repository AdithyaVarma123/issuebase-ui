export function toParams(query: string) {
    const q = query.replace(/^\??\//, '');

    return q.split('&').reduce((values, param) => {
        const [key, value] = param.split('=');

        // @ts-ignore
        values[key] = value;

        return values;
    }, {});
}

export function toQuery(params: any, delimiter: string = '&') {
    const keys = Object.keys(params);

    return keys.reduce((str, key, index) => {
        let query = `${str}${key}=${params[key]}`;

        if (index < (keys.length - 1)) {
            query += delimiter;
        }

        return query;
    }, '');
}
