import { BreakpointStr, } from "@/utils/breakpoint/types";
import { Breakpoint } from "@/utils/breakpoint";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BreakpointState {
    value: BreakpointStr;
}

const initialState: BreakpointState = {
    value: Breakpoint.getBreakpoint()
}

export const breakpointSlice = createSlice({
    name: 'breakpoint',
    initialState,
    reducers: {
        updateBreakpoint: (state, action: PayloadAction<BreakpointStr>) => {
            state.value = action.payload;
        }
    }

});

export const { updateBreakpoint } = breakpointSlice.actions;
export default breakpointSlice.reducer;