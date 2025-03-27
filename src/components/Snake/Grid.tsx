import { CoordinateObj } from "@/hooks/grid";
import styled from "@emotion/styled";
import React from "react";

interface Props {
    squareSize: number;
    gridSize: number;
    grid: null[][];
    children: React.ReactNode;
}

export default function Grid({
    squareSize,
    gridSize,
    grid,
    children
}: Props) {

    return (
        <Wrapper
            className="position-relative"
            gridSize={gridSize}
            squareSize={squareSize}
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
            {children}
        </Wrapper>
    )
}

type WrapperProps = Pick<Props, 'gridSize' | 'squareSize'>;

const Wrapper = styled('div')<WrapperProps>(({ gridSize, squareSize }) => ({
    width: squareSize * gridSize,
    height: squareSize * gridSize,
    border: '5px solid #777',
    boxSizing: 'content-box',
    margin: '0 auto'
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