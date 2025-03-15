import { Breakpoints, BreakpointStr } from "./types";


const breakpoints: Breakpoints = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
}

const breakpointArray = Object.entries(breakpoints) as [BreakpointStr, number][];

export class Breakpoint {
    value: BreakpointStr;

    constructor(breakpoint: BreakpointStr) {
        this.value = breakpoint;
    }

    static getBreakpoint(): BreakpointStr {
        const windowWidth = window.innerWidth;
        switch(true) {
            case windowWidth < breakpoints.sm:
                return 'xs';
            case windowWidth >= breakpoints.sm && windowWidth < breakpoints.md:
                return 'sm';
            case windowWidth >= breakpoints.md && windowWidth < breakpoints.lg:
                return 'md';
            case windowWidth >= breakpoints.lg && windowWidth < breakpoints.xl:
                return 'lg';
            case windowWidth >= breakpoints.xl && windowWidth < breakpoints.xxl:
                return 'xl';
            default:
                return 'xxl'
        }
    }

    private _getIndexes(breakpoint: BreakpointStr): [number, number] {
        const findPredicate = (arr: [BreakpointStr, number], breakpoint: BreakpointStr) => {
            return arr[0] === breakpoint;
        }

        const currentBreakpointIndex = breakpointArray.findIndex(arr => findPredicate(arr, this.value));
        const targetBreakpointIndex = breakpointArray.findIndex(arr => findPredicate(arr, breakpoint))
        return [
            currentBreakpointIndex,
            targetBreakpointIndex
        ]
    }

    public isBelow(breakpoint: BreakpointStr) {

        const [currentBreakpointIndex, targetBreakpointIndex] = this._getIndexes(breakpoint);

        return currentBreakpointIndex < targetBreakpointIndex;
    }

    public isAbove(breakpoint: BreakpointStr) {

        const [currentBreakpointIndex, targetBreakpointIndex] = this._getIndexes(breakpoint);

        return currentBreakpointIndex > targetBreakpointIndex
    }
}