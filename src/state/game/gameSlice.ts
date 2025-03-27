import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    gameMode: boolean;
}

const initialState: State = {
    gameMode: false
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateGameMode: (state, action: PayloadAction<boolean>) => {
            state.gameMode = action.payload;
        }
    }
});

export const { updateGameMode } = gameSlice.actions;
export default gameSlice.reducer;