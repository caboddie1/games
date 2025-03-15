import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { Container } from "reactstrap";

import { Nav, MobileNav, NavLink } from "@/components/Nav";

import { Breakpoint } from "@/utils/breakpoint";
import { RootState } from "@/state/store";


const gameTitles: string[] = [
    'Noughts and Crosses',
    'Connect 4',
    'Word Search'
] 

const games: NavLink[] = gameTitles.map(game => ({
    title: game,
    slug: game.toLowerCase().split(' ').join('-')
}))

export default function Games() {

    const breakpointState = useSelector((state: RootState) => state.breakpoint.value)
    const breakpoint = new Breakpoint(breakpointState);

    return (
        <div>
            {breakpoint.isAbove('sm') ?
                <Nav 
                    links={games}
                />
            :
                <MobileNav
                    links={games}
                />
            }
            <Container fluid style={{ paddingLeft: breakpoint.isAbove('sm') ? 250 : 20 }}>
                <Outlet />
            </Container>
        </div>
    )
}

