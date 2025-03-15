export type BreakpointMapStr = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type BreakpointStr = 'xs' | BreakpointMapStr;


export type Breakpoints = {
    [key in BreakpointMapStr]: number;
}