import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/state/store";
import { updateBreakpoint } from "@/state/breakpoint/breakpointSlice";
import { Breakpoint } from "@/utils/breakpoint/breakpoint";

export function useBreakpoint() {

    const breakpointState = useSelector((state: RootState) => state.breakpoint.value);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {

        function onWindowResize() {
            const breakpoint = Breakpoint.getBreakpoint();
            if (breakpoint !== breakpointState) {
                dispatch(updateBreakpoint(breakpoint));
            }
        }

        window.addEventListener('resize', onWindowResize);

        return () => window.removeEventListener('resize', onWindowResize);
    }, [breakpointState]);
} 