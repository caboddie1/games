import { useState } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from "reactstrap";

import { NavLink as INavLink } from '.';
import { Link } from "react-router";
import styled from "@emotion/styled";

interface Props {
    links: INavLink[]
}

export default function MobileNav({ links }: Props) {

    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => setCollapsed(!collapsed);

    return (
        <NavStyles color="primary" className="mb-4">
            <NavbarBrand href="/" className="me-auto text-light">
                Games
            </NavbarBrand>
            <NavbarToggler onClick={toggleNavbar} className="me-2 text-light" />
            <Collapse isOpen={!collapsed} navbar>
                <Nav navbar>
                    {links.map(link => (
                        <NavItem key={link.slug}>
                            <NavLink 
                                tag={Link}
                                to={link.slug}
                                className="text-light"
                            >
                                {link.title}
                            </NavLink>
                        </NavItem>
                    ))}

                </Nav>
            </Collapse>
      </NavStyles>
    )
}

const NavStyles = styled(Navbar)(() => ({
    background: '#2164d1'
}));