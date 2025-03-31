import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
    accessToken: string | null,
    user: {
        userID: number,
        username: string
    } | null
};

const initialState: LoginState = {
    accessToken: null,
    user: null
}

// export const attemptLogin = createAsyncThunk(
//     "users/loginAttempt", 
//     async (username: string, password: string) => {
//         const response = await fetch("");
//         return response;
// });

const loginSlice = createSlice({
    name: 'loginToken',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<LoginState>) => {
            const { user, accessToken } = action.payload;
            state.accessToken = accessToken;
            state.user = user;
        },
        logOut: (state) => {
            state.accessToken = null;
            state.user = null;
        }
    }
});

export const selectAccessToken = (state: LoginState) => state.accessToken;
export const selectCurrentUset = (state: LoginState) => state.user;

export default loginSlice.reducer;
export const { setCredentials, logOut } = loginSlice.actions;