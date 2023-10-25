import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../../server.js';


export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: server, credentials : "include" }),
    endpoints: (builder) => ({

        userSignup: builder.mutation({
            query: (payload) => ({
                url: '/users/user-signup',
                method: 'post',
                body: payload,
            })
        }),

    })
});


export const { useUserSignupMutation } = apiSlice;
