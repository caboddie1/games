import React from "react";
import NaughtsAndCrosses from "../components/NaughtsAndCrosses"
import { useNavigate, useParams } from "react-router";

type Games = Map<string, {
    title: string;
    component: React.ReactNode;
}>;

const games = new Map([
    [
        'naughts-and-crosses', 
        {
            title: 'Naughts and Crosses',
            component: <NaughtsAndCrosses />
        }
    ]
])

export default function Game() {

    const { id } = useParams();
    const navigate = useNavigate();
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