import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isAuthenticated: false,
    loading: false,
    isLoading: false,
    user: null,
    users: [],
    token:"",
    error: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        userSignupRequest: (state) => {
            state.loading = true;
            state.isAuthenticated = false;
        },

        userSignupSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = action.payload;
        },

        userSignupFailed: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
        },

    }
});

export const { userSignupRequest, userSignupSuccess, userSignupFailed } = authSlice.actions;
export const selectUser = state => state.auth.user;
export default authSlice.reducer;
