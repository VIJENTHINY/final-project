import React, { useState } from 'react';
import styled from 'styled-components';
import profileImage from '../images/profile.jpg';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [passwordValidation, setPasswordValidation] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Check if required fields are empty
        for (const field in formData) {
            if (!formData[field].trim()) {
                newErrors[field] = 'This field is required';
                isValid = false;
            }
        }

        // Validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character';
            isValid = false;
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                setIsSubmitting(true);

                const response = await fetch('/api/user/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    // Handle successful signup, navigate to login page
                    navigate('/login');
                } else {
                    // Handle signup error, display error message to user
                    console.error('Signup error:', data.error);
                }
            } catch (error) {
                console.error('Signup error:', error.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Container>
            <SignupFormContainer>
                <SmallImage src={profileImage} alt="Small Image" />
                <SignupForm onSubmit={handleSignUp}>
                    <Logo>Sign Up</Logo>
                    <StyledTextInput
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        required
                        className={errors.firstname ? 'error' : ''}
                    />
                    {errors.firstname && <ErrorMessage>{errors.firstname}</ErrorMessage>}

                    <StyledTextInput
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        required
                        className={errors.lastname ? 'error' : ''}
                    />
                    {errors.lastname && <ErrorMessage>{errors.lastname}</ErrorMessage>}

                    <StyledTextInput
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Username"
                        required
                        className={errors.username ? 'error' : ''}
                    />
                    {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}

                    <StyledTextInput
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        required
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

                    <StyledTextInput
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                        className={errors.password ? 'error' : ''}
                    />
                    {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

                    <StyledTextInput
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        required
                        className={errors.confirmPassword ? 'error' : ''}
                    />
{errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}

                    <SignupButton type="submit">
                        Sign Up
                    </SignupButton>
                </SignupForm>
            </SignupFormContainer>
        </Container>
    );
};


const ErrorMessage = styled.div`
    color: red;
    font-size: 14px;
    margin-top: 4px;
`;
const SmallImage = styled.img`
    width: 450px; 
    height: 300px;
    border:1px solid;
    border-radius:80%;
`;

const StyledTextInput = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Container = styled.div`
    display: flex;
    height: 90vh;
    background-color: rgba(255, 192, 203, 0.7);
`;

const SignupFormContainer = styled.div`
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

const SignupForm = styled.form`
    width: 100%;
    max-width: 350px;
`;

const SignupButton = styled.button`
    display: block;
    margin-left:85px;
    margin-top:20px;
    width: 50%;
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

export default SignupPage;