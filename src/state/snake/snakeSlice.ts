import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Direction } from '@/components/Snake/types';
import { CoordinateObj } from "@/hooks/grid";

interface State {
    direction: Direction;
    position: CoordinateObj[];
    gameOver: boolean;
    powerUp: CoordinateObj;
    score: number;
    highScore: number;
}

const initialState: State = {
    direction: 'right',
    position: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 4, y: 0 },
        { x: 5, y: 0 },
        { x: 6, y: 0 },
    ],
    gameOver: false,
    powerUp: { x: 7, y: 7 },
    score: 0,
    highScore: 0
}

interface PositionPayload {
    pos: CoordinateObj;
    grow: boolean;
} 

export const snakeSlice = createSlice({
    name: 'snake',
    initialState,
    reducers: {
        updateDirection: (state, action: PayloadAction<Direction>) => {
            state.direction = action.payload;
        },
        updateGameOver: (state, action: PayloadAction<boolean>) => {
            state.gameOver = action.payload;
        },
        updateScore: (state) => {
            state.score += 10;
        },
        updatePowerUp: (state, action: PayloadAction<CoordinateObj>) => {
            state.powerUp = action.payload;
        },
        updateHighScore: (state, action: PayloadAction<number>) => {
            state.highScore = action.payload;
        },
        updatePosition: (state, { payload }: PayloadAction<PositionPayload>) => {
            const head = state.position[state.position.length -1];

            state.position = [
                ...state.position.slice(payload.grow ? 0 : 1),
                {
                    x: head.x + payload.pos.x,
                    y: head.y + payload.pos.y
                }
            ]
        },
        resetState: (state) => {
            state.position = initialState.position;
            state.direction = initialState.direction;
            state.gameOver = initialState.gameOver;
            state.score = initialState.score;
            state.powerUp = initialState.powerUp;
        }
    }
})


export const { 
    updateDirection, 
    updateGameOver, 
    updatePosition, 
    resetState,
    updatePowerUp,
    updateScore,
    updateHighScore
} = snakeSlice.actions;
export default snakeSlice.reducer;