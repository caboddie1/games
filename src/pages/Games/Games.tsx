import styled, { CSSObject } from "@emotion/styled";
import { Link, Outlet } from "react-router";
import { Container } from "reactstrap";

interface Games {
    slug: string;
    title: string;
}

const gameTitles: string[] = [
    'Naughts and Crosses',
] 

const games: Games[] = gameTitles.map(game => ({
    title: game,
    slug: game.toLowerCase().split(' ').join('-')
}))

export default function Games() {

    return (
        <div>
            <Nav className="pt-5">
                {games.map(game => (
                    <Link
                        className="ps-2"
                        key={game.slug}
                        to={`/games/${game.slug}`}
                    >
                        {game.title}
                    </Link>
                ))}
            </Nav>
            <Container style={{ marginLeft: 230 }}>
                <Outlet />
            </Container>
        </div>
    )
}

const Nav = styled('nav')(() => ({
    height: '100vh',
    width: 200,
    position: 'fixed',
    top: 0,
    left: 0,
    background: '#2164d1',
    'a': {
        color: '#fff',
        display: 'block'
    }
} as CSSObject))