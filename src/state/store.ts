import { configureStore } from "@reduxjs/toolkit";
import breakpointReducer from './breakpoint/breakpointSlice';
import snakeReducer from './snake/snakeSlice';

export const store = configureStore({
    reducer: {
        breakpoint: breakpointReducer,
        snake: snakeReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;