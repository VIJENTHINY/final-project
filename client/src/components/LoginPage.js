import React, { useState } from 'react';
import styled from 'styled-components';
import profileImage from '../images/profile.jpg';
import { useNavigate,  Link } from 'react-router-dom';
import { useUserContext } from './UserContext';
import { useReducer } from './userReducer';

const LoginPage = () => {
    
    const navigate = useNavigate();

    const { state, dispatch } = useUserContext();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });


    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                // Login successful
                const data = await response.json();
                const token = data.token;
                localStorage.setItem('token', token);
                dispatch({ type: 'SET_USER', payload: data });
                navigate('/profile');
            } else if (response.status === 404) {
                // User not found
                setEmailError('User not found');
            } else if (response.status === 401) {
                // Incorrect email or password
                setPasswordError('Incorrect email or password');
            } else {
                // Other error
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };




    return (
        <Container>
            <LoginFormContainer>
                <ImageAndFormContainer>
                    <BackgroundImage src={profileImage} alt="Profile" />
                    <LoginForm onSubmit={handleLogin}>
                        <Logo>Login</Logo>
                                                    <FormGroup>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                <ErrorMessage>{emailError}</ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <ErrorMessage>{passwordError}</ErrorMessage>
                            </FormGroup>
                        <LoginButton type="submit">Login</LoginButton>
                    </LoginForm>
                </ImageAndFormContainer>
                <SignupLink to="/signup">New here? Sign up</SignupLink>
            </LoginFormContainer>
        </Container>
    );
};

const ImageAndFormContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
`;
const ErrorMessage = styled.div`
    color: red;
    font-size: 14px;
    margin-top: 5px;
`;
const SignupLink = styled(Link)`
    display: block;
    margin-top: 20px;
    text-align: center;
    color: #007bff;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
        color: #0056b3;
    }
`;
const Container = styled.div`
    display: flex;
    height: 90vh;
    background-color: rgba(255, 192, 203, 0.7);
`;

const BackgroundImage = styled.img`
    width: 500px;
    height: 500px;
    object-fit: cover;
    margin-right: 10px;
`;

const LoginFormContainer = styled.div`
    flex: 1;
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px;
`;

const Logo = styled.h1`
    font-size: 36px;
    margin-bottom: 20px;
`;

const LoginForm = styled.form`
    width: 100%;
    max-width: 300px;
    
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const LoginButton = styled.button`
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #0056b3;
    }
`;

export default LoginPage;




