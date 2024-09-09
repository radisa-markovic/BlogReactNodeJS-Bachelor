import { DEV_API_ROOT } from "./config";

interface AuthProvider
{
    accessToken: string | null,
    userData: {
        id: number,
        username: string,
    } | null,
    login(username: string, password: string): Promise<any>,
    logout(): Promise<void>,
    checkAuthStatus(): Promise<any>,
};

export const authProvider: AuthProvider = {
    accessToken: null,
    userData: null,
    async login(username: string, password: string) {
        const request: RequestInit = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            mode: 'cors',
            /**==>> must be present for cookies to be set */
            credentials: "include",
            body: JSON.stringify({
                username,
                password
            })
        };
    
        return await fetch(DEV_API_ROOT + "/users/login", request);
    },
    async logout() {
        const response = await fetch(DEV_API_ROOT + "/users/logout", {
            mode: 'cors',
            credentials: 'include',
            method: "POST",
            body: JSON.stringify(authProvider.userData)
        });

        if(response.ok)
        {
            alert("User is logged out");
            authProvider.accessToken = null;
            authProvider.userData = null;
        }
    },
    async checkAuthStatus() {
        const response = await fetch(DEV_API_ROOT + "/users/auth", {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors',
            method: "POST"
        });
        if(response.ok)
        {
            const jsonResponse = await response.json() as {
                accessToken: string,
                userData: {
                    id: number
                    username: string,
                }
            };

            authProvider.accessToken = jsonResponse.accessToken;
            authProvider.userData = jsonResponse.userData;
        }
        else
        {
            authProvider.accessToken = null;
            authProvider.userData = null;
        }

        //it's required for a loader to return *something*
        //presumably null if I'm not interested in the value
        return authProvider;
    },
};