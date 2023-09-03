import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <NavbarWrapper>
            <NavigationBar>
                <NavItem to="/login">Login</NavItem>
                <NavItem to="/signup">Sign Up</NavItem>
            </NavigationBar>
        </NavbarWrapper>
    );
};

const NavigationBar = styled.div`
    display: flex;
    justify-content: center;
    z-index: 1; 
`;

const NavbarWrapper = styled.div`
    background-color: pink;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100px;
    width: 100%;
    margin: 0;
`;

const NavItem = styled(Link)`
    font-size: 30px;
    color: white;
    text-decoration: none;
    margin-left: 20px;
    margin-right:10px;
    &:hover {
        color: #FFB700;
        border-bottom: #FFB700 0.125em solid;
    }
`;

export default NavBar;