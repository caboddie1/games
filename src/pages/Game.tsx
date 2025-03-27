import NaughtsAndCrosses from "../components/NoughtsAndCrosses"
import { useParams } from "react-router";
import ConnectFour from "../components/ConnectFour";
import WordSearch from "../components/WordSearch";
import Snake from "@/components/Snake";
import { useAppSelector } from "@/state/hooks";
import { useEffect } from "react";

const games = new Map([
    [
        'noughts-and-crosses', 
        {
            title: 'Noughts and Crosses',
            component: <NaughtsAndCrosses />
        }
    ],
    [
        'connect-4',
        {
            title: 'Connect 4',
            component: <ConnectFour />
        }
    ],
    [
        'word-search',
        {
            title: 'Word Search',
            component: <WordSearch />
        }
    ],
    [
        'snake',
        {
            title: 'Snake',
            component: <Snake />
        }
    ]
])

export default function Game() {

    const { id } = useParams();
    const game = games.get(id || '');
    const gameMode = useAppSelector(state => state.game.gameMode);

    useEffect(() => {
        if (gameMode) {
            document.body.style.overflow = 'Hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [gameMode]);

    return (
        <div>
            {!game ?
                <p>Game not Found</p>
            :
                <>
                    {!gameMode &&
                        <h1>
                            {game.title}
                        </h1>
                    }
                    {game.component}
                </>
            }
        </div>
    )
}