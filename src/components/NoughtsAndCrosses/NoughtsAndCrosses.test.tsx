import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoughtsAndCrosses from './NoughtsAndCrosses';
import '@testing-library/dom'
import '@testing-library/jest-dom'

function setup() {
    return render (
        <NoughtsAndCrosses />
    )
}

async function gamePlaythrough(moves: string[]) {
    const container = setup();
    const user = userEvent.setup();


    for (const move of moves) {
        await user.click(container.getByLabelText(move))
    }

    return container;
}

describe('noughtsAndCrosses', () => {
    it('correctly detects player 1 win', async () => {
        const moves = ['y0x0', 'y1x0', 'y0x1', 'y2x0', 'y0x2']
        const { getByText } = await gamePlaythrough(moves);

        await waitFor(() => {
            expect(getByText('Player 1 wins')).toBeInTheDocument()
        })
    });

    it('correctly detects player 2 win', async () => {
        const moves = ['y1x0', 'y0x0', 'y2x2', 'y0x1', 'y2x1', 'y0x2']
        const { getByText } = await gamePlaythrough(moves);

        await waitFor(() => {
            expect(getByText('Player 2 wins')).toBeInTheDocument()
        }) 
    });

    it('corrctly detects no win', async () => {
        const moves = ['y0x0', 'y2x0', 'y0x2', 'y2x2', 'y1x1','y0x1', 'y2x1', 'y1x0', 'y1x2']


        
        const { getByText } = await gamePlaythrough(moves)

        await waitFor(() => {
            expect(getByText('No Winner!')).toBeInTheDocument();
        });
    });
});