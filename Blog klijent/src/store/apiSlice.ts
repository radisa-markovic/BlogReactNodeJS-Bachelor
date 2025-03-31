import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from './login';

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3001",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        //@ts-ignore
        const token = getState().auth.token;
        if(token)
        {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (
    args: string | FetchArgs, 
    api: BaseQueryApi, 
    extraOptions: any
) => {
    let result = await baseQuery(args, api, extraOptions);
    
    //@ts-ignore
    if(result?.error?.originalStatus === 403)
    {
        console.log("Sending refresh token");
        //send refresh token to get new access token
        const refreshResult = await baseQuery("/me", api, extraOptions);
        if(refreshResult?.data)
        {
            //@ts-ignore
            const user = api.getState().auth.user;
            //store the new token
            //@ts-ignore
            api.dispatch(setCredentials({
                ...refreshResult.data,
                user
            }));
            //retry the original query with new access token
            result = await baseQuery(args, api, extraOptions);
        }
        else
        {
            api.dispatch(logOut());
        }
    }

    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({})
})