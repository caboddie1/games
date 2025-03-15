import styled, { CSSObject } from "@emotion/styled"
import { Link } from "react-router"
import { NavLink } from ".";



interface Props {
    links: NavLink[];
}

export default function Nav({ links }: Props) {
    return (
        <NavStyles className="pt-5">
            {links.map(link => (
                <Link
                    className="ps-2"
                    key={link.slug}
                    to={`/games/${link.slug}`}
                >
                    {link.title}
                </Link>
            ))}
        </NavStyles>
    )
}

const NavStyles = styled('nav')(() => ({
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