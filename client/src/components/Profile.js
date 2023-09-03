import React, { useEffect, useState } from 'react';
import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import SidebarAndTopNavBar from './SideBarAndTopNavBar';
import styled from 'styled-components';
import profile from '../images/profileImage.webp';

const Profile = () => {
    const { state: userContextState, dispatch: userContextDispatch } = useUserContext();
    const navigate = useNavigate();
    const [biography, setBiography] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBiography(data.user.biography || ''); 
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

    const handleProfileUpdate = async () => {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ biography }),
            });

            if (response.ok) {
                setIsEditing(false);
                console.log('Profile biography updated successfully');
            } else {
                console.error('Profile biography update failed');
            }
        } catch (error) {
            console.error('Error updating biography:', error);
        }
    };

    return (
        <Container>
            <SidebarAndTopNavBar />
            <MainContent>
                {userContextState.user ? (
                    <ProfileContainer>
                        <ProfileHeader>
                            <ProfilePictureContainer>
                                <ProfilePicture src={profile} alt="" />
                            </ProfilePictureContainer>
                        </ProfileHeader>
                        <ProfileInfo>
                        <p>{userContextState.user.firstname}  {userContextState.user.lastname}  </p>
                            <p>Username:@ {userContextState.user.username}</p>
                            <p>Email: {userContextState.user.email}</p>
                        </ProfileInfo>
                        {isEditing ? (
                            <EditBiographyContainer>
                                <BiographyTextarea
                                    placeholder="Add a headline"
                                    value={biography}
                                    onChange={(e) => setBiography(e.target.value)}
                                />
                                <ButtonGroup>
                                    <CancelButton onClick={() => setIsEditing(false)}>Cancel</CancelButton>
                                    <UpdateButton onClick={handleProfileUpdate}>Save</UpdateButton>
                                </ButtonGroup>
                            </EditBiographyContainer>
                        ) : (
                            <div>
                                <Biography>
                                    <Div>{biography}</Div>
                                    <EditButton onClick={() => setIsEditing(true)}>
                                        Edit Biography
                                    </EditButton>
                                </Biography>
                            </div>
                        )}
                    </ProfileContainer>
                ) : (
                    <p>Please log in to view your profile.</p>
                )}
            </MainContent>
        </Container>
    );
};

const LogoDiv = styled.div`

    font-family: 'Dancing Script', cursive
`;
const Div = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #4a5759;
    padding: 20px 10px;
    width: 400px;
    text-align: justify;
    outline: none;
    border-radius: 5px;
    background-color: #f7e1d7;
    margin-bottom: 5px;
`
const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #1e6091;
`;
const EditBiographyContainer = styled.div`
    text-align: center;
    margin-top: 20px;
`;

const BiographyTextarea = styled.textarea`
    width: 25%;
    padding: 8px;
    border: 1px solid #e1e1e1;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
`;

const CancelButton = styled.button`
    background-color: #e1e1e1;
    color: #333;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    margin-right: 10px;
`;

const UpdateButton = styled.button`
    background-color: #1877f2;
    color: #ffffff;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
`;

const MainContent = styled.div`
    flex: 1;
    padding: 40px;
    margin: 0 auto;
    min-height: 80vh;
`;

const Biography = styled.div`
    margin: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
    height: 90%;
    border: 5px solid #eed7c5;
    border-radius: 3px;
    padding: 0 10px 10px 10px;
`;

const ProfileContainer = styled.div`
    background-color: #ffffff;
    border: 1px solid #e1e1e1;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    overflow: hidden;
    position:relative;
`;

const ProfileHeader = styled.div`
    position: relative;
    overflow: hidden;
    height: 40vh;
`;

const CoverPhoto = styled.div`
    height: 200px;
    background-image: url('your-cover-image.jpg');
    background-size: cover;
    background-position: center;
    border: solid 1px;
`;

const ProfilePictureContainer = styled.div`
    text-align: center;
    border: solid 1px;
    display: flex;
    justify-content: center;
    margin: 10px;
    padding: 10px;
    background-color: #1e6091;
    height: 25vh;
`;

const ProfilePicture = styled.img`
    width: 250px;
    height: 250px;
    background-position: center;
    border-radius: 50%;
    border: 4px solid #ffffff;
    border: solid 1px;
    position: absolute;
    top: 100px;
    left: 43%;
`;

const ProfileInfo = styled.div`
    text-align: center;
    font-size: 20px;
    margin-top: 10px;
`;

const EditButton = styled.button`
    background-color: #5e548e;
    color: #ffffff;
    border: none;
    padding: 15px 24px;
    border-radius: 28px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: #5e548e;
    }
`;

export default Profile;