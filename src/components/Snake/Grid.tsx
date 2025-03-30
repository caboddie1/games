import { CoordinateObj } from "@/hooks/grid";
import styled from "@emotion/styled";
import { Variant } from "./types";
import React from "react";

interface Props {
    squareSize: number;
    gridSize: number;
    grid: null[][];
    variant: Variant;
}

function _Grid({
    squareSize,
    gridSize,
    grid,
    variant,
}: Props) {
    console.log('grid render')
    return (
        <Wrapper
            className="position-relative"
            gridSize={gridSize}
            squareSize={squareSize}
            borderPx={variant === 'Snake' ? 5 : 1}
        >
            {grid.map((row, y) => (
                <div key={`y${y}`} className="">
                    {row.map((_, x) => (
                        <Square 
                            key={`y${y}x${x}`} 
                            pos={{ x, y}}
                            squareSize={squareSize}
                        />
                    ))}
                </div>
            ))}
        </Wrapper>
    )
}

const Grid = React.memo(_Grid, () => true);

export default Grid;

type WrapperProps = Pick<Props, 'gridSize' | 'squareSize'> & {
    borderPx: number;
};

const Wrapper = styled('div')<WrapperProps>(({ gridSize, squareSize, borderPx }) => ({
    width: squareSize * gridSize,
    height: squareSize * gridSize,
    border: `${borderPx}px solid #777`,
    boxSizing: 'content-box',
}));

type SquareProps = Pick<Props, 'squareSize'> & {
    pos: CoordinateObj;
};

const Square = styled('div')<SquareProps>(({ squareSize, pos: { x, y } }) => ({
    width: squareSize, 
    height: squareSize,
    position: 'absolute',
    top: y * squareSize,
    left: x * squareSize
}));