import { BreakpointStr, } from "@/utils/breakpoint/types";
import { Breakpoint } from "@/utils/breakpoint";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BreakpointState {
    value: BreakpointStr;
    screen: {
        height: number;
        width: number;
    }
}

const initialState: BreakpointState = {
    value: Breakpoint.getBreakpoint(),
    screen: Breakpoint.getBrowserDimensions()
}

export const breakpointSlice = createSlice({
    name: 'breakpoint',
    initialState,
    reducers: {
        updateBreakpoint: (state, action: PayloadAction<BreakpointStr>) => {
            state.value = action.payload;
        },
        updateScreen: (state, action: PayloadAction<BreakpointState['screen']>) => {
            state.screen = action.payload;
        }
    }

});

export const { updateBreakpoint, updateScreen } = breakpointSlice.actions;
export default breakpointSlice.reducer;