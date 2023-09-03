import React from 'react';
import styled from 'styled-components';
import NavBar from './Navbar';
import backgroundImage1 from '../images/backgroundImage.PNG';
import backgroundImage2 from '../images/backgroundImage2.jpg';

const HomePage = () => { 
    return (
        <HomeContainer>
            <BackgroundGrid>
                <BackgroundImageLeft src={backgroundImage1} alt="Background" />
                <BackgroundImageRight src={backgroundImage2} alt="Background" />
            </BackgroundGrid>
            <NavBarWrapper>
                <NavBar />
            </NavBarWrapper>
            <ContentWrapper>
                <ContentBox>
                    <WelcomeMessage>
                        Welcome to I and meOrganize!
                    </WelcomeMessage>
                    <MotivationalMessage>
                        Embrace Innovation and Take Control of Your Education Journey!
                        <br />
                        Explore new ideas, set goals, and manage your time effectively.
                        <br />
                        Let curiosity be your guide and determination your fuel.
                        <br />
                        Remember, you have the power to shape your future!
                    </MotivationalMessage>
                </ContentBox>
            </ContentWrapper>
        </HomeContainer>
    );
};

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color:  pink;
    min-height: 95vh;
    width: auto;

`;

const BackgroundGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    height: 100%;
    position: absolute;
`;

const BackgroundImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
`;

const BackgroundImageLeft = styled(BackgroundImage)`
    grid-column: 1 / span 1;
`;

const BackgroundImageRight = styled(BackgroundImage)`
    grid-column: 2 / span 1;
`;

const NavBarWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    width:50%;
`;

const ContentWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 160px;
    z-index: 1;
`;

const ContentBox = styled.div`
    background-color: rgb(255, 255, 255);
    padding: 30px;
    border-radius: 10px;
    text-align: center;
`;

const WelcomeMessage = styled.h1`
    font-size: 28px;
    margin-top: 20px;
`;

const MotivationalMessage = styled.p`
    font-size: 18px;
    margin-top: 20px;
    line-height: 1.5;
    font-weight: bold;
`;

export default HomePage;