import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./apiSlice";
import loginReducer from './login';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;