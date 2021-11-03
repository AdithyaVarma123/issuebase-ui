export async function googleLoginForIssueBase(data: any) {
    const params = new URLSearchParams();
    params.set("name", data.payload.profileObj.name)
    params.set("email", data.payload.profileObj.email)
    params.set("token", data.payload.tokenObj.access_token)

    if (data.hasOwnProperty("username")) {
        params.set("username", data.username);
        params.set("phone", data.phone)
    }

    try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/oauth/google?${params.toString()}`);
        const data = await res.json();
        if (data.new_user) {
            return {
                state: 'new_user'
            };
        }

        return {
            state: 'done',
            tokens: {
                id_token: data.id_token,
                access_token: data.access_token,
                refresh_token: data.refresh_token
            }
        };
    }
    catch(err) {
        return {
            state: 'error'
        }
    }
}

export async function checkUserName(username: string) {
    try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/oauth/checkUsername?username=${username}`)
        const data = await res.json();
        return data.available;
    }
    catch (err) {
        return false;
    }
}

export async function githubLoginForIssueBase(data: any) {
    const params = new URLSearchParams();
    params.set("code", data.code)

    if (data.hasOwnProperty("phone")) {
        params.set("phone", data.phone)
        params.set("username", data.username)
    }

    try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/oauth/github?${params.toString()}`);
        const data = await res.json();
        if (res.status > 204) {
            return false;
        }
        if (data.new_user) {
            return {
                state: 'new_user',
                code: data.code
            };
        }
        return {
            state: 'done',
            tokens: {
                id_token: data.id_token,
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                github_access_token: data.github_access_token
            },
            user: {
                imageUrl: data.imageUrl,
                username: data.username
            }
        };
    }
    catch(err) {
        return false;
    }
}

export async function autoLogin(tokens: any, method: 'github' | 'google' | 'oauth', access_token ?: string) {
    const params = new URLSearchParams();
    params.set("method", method);
    params.set("id_token", tokens.id_token);
    if (typeof access_token === 'string') {
        params.set('access_token', access_token);
    }

    let res;
    try {
        res = await fetch(`${process.env.REACT_APP_BASE_URL}/oauth/autoLogin?${params.toString()}`);
        return (await res.json());
    }
    catch (err) {
        return false;
    }
}

export async function createUser(email: string, password: string, phone: string, username: string, name: string) {
    let res: Response;
    try {
        res = await fetch(`${process.env.REACT_APP_BASE_URL}/oauth/createUser`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                phone,
                username,
                name
            })
        });
        if (res.status === 200) {
            return {
                message: 'Account created successfully!'
            };
        }
    }
    catch(err) {
        // @ts-ignore
        if (res.status === 401) {
            return {
                error: err,
                message: 'Email belongs to another account!'
            };
        }
        // @ts-ignore
        return {
            error: err,
            message: 'An unknown error occurred!'
        };
    }
}

export async function oauthLogin(email: string, password: string) {
    let res: Response;
    let params = new URLSearchParams();
    params.set("username", email);
    params.set("password", password);
    try {
        res = await fetch(`${process.env.REACT_APP_BASE_URL}/oauth/authorize?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data: { code: string } = await res.json();

        params = new URLSearchParams();
        params.set("code", data.code);
        res = await fetch(`${process.env.REACT_APP_BASE_URL}/oauth/token?${params.toString()}`);

        const tokens: { id_token: string, access_token: string, refresh_token: string } = await res.json();

        if (res.status === 200) {
            return { tokens };
        }
    }
    catch(err) {
        // @ts-ignore
        if (res.status === 401) {
            return {
                error: err,
                message: 'Incorrect email or password!'
            };
        }

        // @ts-ignore
        return {
            error: err,
            message: 'An unknown error occurred!'
        };
    }
}
