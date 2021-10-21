export async function googleLoginForIssueBase(data: any) {
    const params = new URLSearchParams();
    params.set("name", data.payload.profileObj.name)
    params.set("email", data.payload.profileObj.email)

    if (data.hasOwnProperty("username")) {
        params.set("username", data.username);
        params.set("phone", data.phone)
        params.set("token", data.payload.tokenObj.access_token)
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
