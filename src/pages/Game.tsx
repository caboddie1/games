import NaughtsAndCrosses from "../components/NaughtsAndCrosses"
import { useParams } from "react-router";
import ConnectFour from "../components/ConnectFour";

const games = new Map([
    [
        'naughts-and-crosses', 
        {
            title: 'Naughts and Crosses',
            component: <NaughtsAndCrosses />
        }
    ],
    [
        'connect-4',
        {
            title: 'Connect 4',
            component: <ConnectFour />
        }
    ]
])

export default function Game() {

    const { id } = useParams();
    const game = games.get(id || '');


    return (
        <div>
            {!game ?
                <p>Game not Found</p>
            :
                game.component
            }
        </div>
    )
}