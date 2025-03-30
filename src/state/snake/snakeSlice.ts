import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Direction } from '@/components/Snake/types';
import { CoordinateObj } from "@/hooks/grid";

interface State {
    direction: Direction;
    position: CoordinateObj[];
    gameOver: boolean;
    powerUp: {
        position: CoordinateObj;
        count: number;
    };
    specialPowerUp: {
        position: CoordinateObj[] | null;
        unixStartTime: number | null;
    };
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
    powerUp: {
        position: { x: 7, y: 7 },
        count: 0
    },
    specialPowerUp: {
        position: null,
        unixStartTime: null
    },
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
        updateScore: (state, action: PayloadAction<number>) => {
            state.score += action.payload;
        },
        updatePowerUp: (state, action: PayloadAction<CoordinateObj>) => {
            state.powerUp = {
                position: action.payload,
                count: state.powerUp.count += 1
            }
        },
        updateSpecialPowerUp: (state, action: PayloadAction<State['specialPowerUp']>) => {
            state.specialPowerUp = action.payload;
        },
        updateHighScore: (state, action: PayloadAction<number>) => {
            state.highScore = action.payload;
        },
        updatePosition: (state, { payload }: PayloadAction<PositionPayload>) => {

            state.position = [
                ...state.position.slice(payload.grow ? 0 : 1),
                {
                    x: payload.pos.x,
                    y: payload.pos.y
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
    updateSpecialPowerUp,
    updateScore,
    updateHighScore
} = snakeSlice.actions;
export default snakeSlice.reducer;