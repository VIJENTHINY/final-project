
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import logoImage from '../images/profile.jpg';
import { useEffect } from 'react';
import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';


    const SidebarAndTopNavBar = () => {
            const { state: userContextState, dispatch: userContextDispatch } = useUserContext();
            const navigate = useNavigate();
        
            const handleLogout = () => {
            // Dispatch the 'LOGOUT' action to the user context
            userContextDispatch({ type: 'LOGOUT' });
        
            // Additional logout logic (e.g., clear token from localStorage)
            localStorage.removeItem('token');
            navigate('/login'); // Redirect to login page after logout
            };
        
            const handleLogin = async () => {
            try {
                const response = await fetch('/api/user/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                });
        
                if (response.ok) {
                const data = await response.json();
                console.log(data);
                userContextDispatch({type: 'SET_USER', payload: data.user});
                } else {
                navigate('/login');
                console.error('Login failed');
                }
            } catch (error) {
                navigate('/login');
                console.error('Error logging in:', error);
            }
            };
        
            useEffect(() => {
            handleLogin();
            }, []);
        
            return (
                <NavContainer>
                    <TopNavigationBar>
                        <ProfileInfo>
                            <LogoImage src={logoImage} alt="Profile Image" />
                            <LogoDiv> I&meOrganize </LogoDiv>
                            {userContextState.user ? (
                                <>
                                    <ProfileName>@{userContextState.user.firstname}!</ProfileName>
                                    <SignOutButton onClick={handleLogout}>Sign Out</SignOutButton>
                                </>
                            ) : (
                                <NavLink to="/login">Login</NavLink>
                            )}
                        </ProfileInfo>
                    </TopNavigationBar>
                    <SidebarContainer>
                        <NavLinkItem to="/profile">Profile</NavLinkItem>
                        <NavLinkItem to="/subjects">Subjects</NavLinkItem>
                        <NavLinkItem to="/calendar">Calendar</NavLinkItem>
                    </SidebarContainer>
                </NavContainer>
            );
        };

const NavContainer = styled.nav`
    display: flex;
    flex-direction: column;
    background-color: #2c3e50;
    color: white;
    min-height: 100vh;
    width: 250px;
`;

const LogoDiv = styled.div`
    font-family: 'Dancing Script', cursive;
    font-size: 40px;
`;

const TopNavigationBar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #555;
    background-color: rgba(255, 192, 203, 0.5);
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
`;

const LogoImage = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 5px;
`;

const ProfileName = styled.h3`
    font-size: 18px;
    font-weight: bold;
`;

const SignOutButton = styled.button`
    background-color: #1e6091; 
    color: #fff;
    border: none;
    border-radius: 1px;
    padding: 15px 20px;
    cursor: pointer;

    &:hover {
        background-color: #168aad; 
    }
`;

const SidebarContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;

    display: flex;
    // flex-direction: row;
    // align-items: center;
    // justify-content: center;
    // color:#999;
    // font-size: 1rem;
    // transition:all .1s linear;
    // -webkit-transition:all .1s linear;
    // padding: 10px 0;
    background: transparent;
    font-size: 0.80rem;
    font-family: 'Dancing Script', cursive;

`;

const NavLinkItem = styled(NavLink)`
    text-decoration: none;
    color: white;
    margin: 5px;
    border-radius: 5px;
    font-size: 2em;
    text-align: center;

    
    bottom: 0; 
    background: rgb(0, 0, 0); 
    background: rgba(0, 0, 0, 0.3); 
    color: #f1f1f1; 
    width: 80%; 
    overflow: hidden;
    padding: 20px; 

    &:hover {
        background-color: #555;
        padding: 15px 0px;
        width: 100%;
        text-align: center;
        overflow: hidden;
    }
`;

export default SidebarAndTopNavBar;