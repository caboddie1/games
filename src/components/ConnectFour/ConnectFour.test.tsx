import { render, waitFor } from '@testing-library/react';
import ConnectFour from './ConnectFour';
import userEvent from '@testing-library/user-event';

function setup() {
    return render(
        <ConnectFour />
    )
}

describe('ConnectFour', () => {
    it('correctly drops counter to available space', async () => {
        const user = userEvent.setup();
        const { getByLabelText, getByText } = setup();

        user.click(getByLabelText('y0x0'));

        await waitFor(() => {
            expect(getByText('player 2s turn')).toBeInTheDocument();
        })

        await waitFor(() => {
            expect(getByLabelText('y5x0').children[0]).toHaveStyle({'background': 'red'});
        });
    });

    it('correctly detects player 1 win', async () => {
        const user = userEvent.setup();
        const { getByLabelText, getByText } = setup();
    
        const moves = Array.from({ length: 7 }, ((_, i) => {
            return i % 2 === 0 ? 'y0x0' : 'y0x1'
        }));

        for (const move of moves) {
            user.click(getByLabelText(move)); 
        }

        await waitFor(() => {
            expect(getByText('player 1 has won'))
        });

    });

    it('correct detects player 2 win', async () => {
        const user = userEvent.setup();
        const { getByLabelText, getByText } = setup();
        const moves = Array.from({ length: 22 }, (_, i) => {
            const x = i % 7;
            return `y0x${x}`
        });

        for (const move of moves) {
            user.click(getByLabelText(move))
        }
        
        await waitFor(() => {
            expect(getByText('player 2 has won')).toBeInTheDocument();
        });
    });
});
