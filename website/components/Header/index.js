import React, { useEffect, useState } from "react";
import { Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, NavLink } from "reactstrap";
import { connect } from "react-redux";
import Router from 'next/router'
import Link from "next/link";

import { AuthService } from "../../services/Auth";
import authConstants from "../../constants/Authentication";
import MenuLink from "../MenuLink";
import { logout } from "../../helpers/Services";

const Header = ({user, loggedIn, dispatch}) => {

    const [loaded, setLoaded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const cb = () => {
        dispatch({type: authConstants.LOGOUT});
        logout();
        Router.push({
            pathname: '/'
        })
    }

    const handleLogout = () => {
        AuthService.logout()
            .then(() => cb() )
            .catch(() => cb() )
    };

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <header className="header">
            <Container>
                <Navbar light expand="lg">
                    <NavbarBrand className="logo" href="/">
                        <img alt="" src="/img/logo.png" /> coronavirus army
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <MenuLink activeClassName="active" href="/">
                                <li className="nav-item">
                                    <a className="nav-link">Home</a>
                                </li>
                            </MenuLink>
                            <MenuLink activeClassName="active" href="/volunteers">
                                <li className="nav-item">
                                    <a className="nav-link">Volunteers</a>
                                </li>
                            </MenuLink>
                            <MenuLink activeClassName="active" href="/initiatives">
                                <li className="nav-item">
                                    <a className="nav-link">Initiatives</a>
                                </li>
                            </MenuLink>
                            <li className="nav-item">
                                <a href="https://medium.com/coronavirusarmy" target="_blank" className="nav-link">Blog</a>
                            </li>
                            <li className="nav-item">
                                <a href="https://github.com/CoronavirusArmy" target="_blank" className="nav-link">Github</a>
                            </li>
                            <li className="nav-item">
                                <a href="https://discord.gg/Py7JSge" target="_blank" className="nav-link">Discord</a>
                            </li>
                        </Nav>
                        <Nav className="ml-auto" navbar>
                            {loaded && !loggedIn && (
                                <NavItem>
                                    <Link href="/login">
                                        <a className="nav-link" >Log In</a>
                                    </Link>
                                </NavItem>
                            )}
                            {loaded && loggedIn && user && (
                                <React.Fragment>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav>
                                            <span className="name">{user.profile.name}</span>
                                            <div className="avatar-container">
                                                <div className="avatar" style={{ backgroundImage: `url(${user.profile.img ? user.profile.img : "/img/no-image.png"})` }}></div>
                                            </div>
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem tag="a" href="/account">
                                                Account
                                            </DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </React.Fragment>
                            )}
                        </Nav>
                    </Collapse>
                </Navbar>
            </Container>
        </header>
    );
};

const mapStateToProps = state => {

    const { user, loggedIn, } = state.authentication;
    return { user, loggedIn };

}

export default connect(mapStateToProps)(Header);
