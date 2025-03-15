import { configureStore } from "@reduxjs/toolkit";
import breakpointReducer from './breakpoint/breakpointSlice';

export const store = configureStore({
    reducer: {
        breakpoint: breakpointReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;