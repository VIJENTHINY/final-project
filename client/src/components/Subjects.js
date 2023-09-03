import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import SidebarAndTopNavBar from './SideBarAndTopNavBar';
import { useUserContext } from './UserContext';

const Subjects = () => {
    const { state: userContextState } = useUserContext();
    const [subjects, setSubjects] = useState([]);
    const [newSubjectTitle, setNewSubjectTitle] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const currentUser = userContextState.user;

    useEffect(() => {
        if (currentUser) {
            fetchSubjects();
        }
    }, [currentUser]);

    const fetchSubjects = async () => {
        try {
            const response = await fetch('/api/subjects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            const data = await response.json();
            setSubjects(data);
        } catch (error) {
            console.error(error);
        }
    };

    const createSubject = async () => {
        try {
            const response = await fetch('/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title: newSubjectTitle }),
            });

            if (response.ok) {
                fetchSubjects(); // Refresh the subject list
                setNewSubjectTitle('');
                setShowCreateForm(false);
            } else {
                console.error('Failed to create subject');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (subjectId) => {
        fetch(`/api/subjects/${subjectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (response.ok) {
                const updatedSubjects = subjects.filter(subject => subject._id !== subjectId);
                setSubjects(updatedSubjects);
            } else {
                console.error(`Failed to delete subject with status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error(error);
        });
    };

    const handleShowCreateForm = () => {
        setShowCreateForm(true);
    };

    const handleSelectSubject = (subjectId) => {
        const selected = subjects.find(subject => subject._id === subjectId);
        setSelectedSubject(selected);
    };

    return (
        <Container>
            <SidebarAndTopNavBar />
            <MainContent>
                <Header>
                    <HeaderText>Subjects</HeaderText>
                    <CreateButton onClick={handleShowCreateForm}>+</CreateButton>
                </Header>
                <Content>
                    <MediumContainer>
                        {showCreateForm ? (
                            <NewSubjectForm>
                                <input
                                    type="text"
                                    value={newSubjectTitle}
                                    onChange={e => setNewSubjectTitle(e.target.value)}
                                    placeholder="Enter subject title"
                                />
                                <SaveButton onClick={createSubject}>Save</SaveButton>
                            </NewSubjectForm>
                        ) : null}
                        {subjects.map(subject => (
                            <SubjectCard key={subject._id}>
                                <SubjectTitle>{subject.title}</SubjectTitle>
                                <CardLinks>
                                    <Link
                                        to={`/subjects/${subject._id}`}
                                        onClick={() => handleSelectSubject(subject._id)}
                                        style={{backgroundColor:"#168aad", borderRadius: "28px", color: "#fff" }}
                                    >
                                        <p>Notes</p>
                                    </Link>
                                    <Link to={`/subjects/${subject._id}/homeworks`} 
                                    style={{color: "#003d5b"}}
                                    
                                    >Go To Homework</Link>
                                </CardLinks>
                                <DeleteButton onClick={() => handleDelete(subject._id)}>Delete</DeleteButton>
                            </SubjectCard>
                        ))}
                        {selectedSubject && (
                            <div>
                                <h2>Selected Subject: {selectedSubject.title}</h2>
                            </div>
                        )}
                    </MediumContainer>
                </Content>
            </MainContent>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    background-color: #f5f5f5;
    min-height: 100vh;
    background: radial-gradient(circle at top, #85d3f9 , #e9ecc0)

    `;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background-color: #1e6091; 
    // background-color: #03045e; 
    padding: 15px; 
    color: #fff; 
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); 
    
`;
const HeaderText = styled.h2`
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    font-family: 'Dancing Script', cursive;
    background: #168aad;
    /* border-radius: 30px; */
    padding: 20px 25px;
    border: 1px solid #fff;
    border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Cstyle%3Epath%7Banimation:stroke 5s infinite linear%3B%7D%40keyframes stroke%7Bto%7Bstroke-dashoffset:776%3B%7D%7D%3C/style%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%232d3561' /%3E%3Cstop offset='25%25' stop-color='%23c05c7e' /%3E%3Cstop offset='50%25' stop-color='%23f3826f' /%3E%3Cstop offset='100%25' stop-color='%23ffb961' /%3E%3C/linearGradient%3E %3Cpath d='M1.5 1.5 l97 0l0 97l-97 0 l0 -97' stroke-linecap='square' stroke='url(%23g)' stroke-width='3' stroke-dasharray='388'/%3E %3C/svg%3E") 1;

`;

const MainContent = styled.div`
    flex: 1;
    // padding: 20px;
`;

const Content = styled.div`
    display: flex;
    align-items: center;
`;

const MediumContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-left: 15px;
`;

const CreateButton = styled.button`
    background-color: #34a0a4;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 24px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

const NewSubjectForm = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    input {
        width: 100%;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-right: 10px;
    }
`;

const SaveButton = styled.button`
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: #218838;
    }
`;

const SubjectCard = styled.div`
    background-color: #fff;
    border: 1px solid #ccc;
 
    padding: 20px;
    width: 300px;
    margin: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease-in-out;
    background: linear-gradient(315deg, #d1f985 0%, #c0e4ec 100%);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(2px);
    box-shadow: rgba(2,62,138, 0.4) -5px 5px, rgba(2,62,138, 0.3) -10px 10px, rgba(2,62,138, 0.2) -15px 15px, rgba(2,62,138, 0.1) -20px 20px, rgba(2,62,138, 0.05) -15px 25px;
    border-radius: 15px;
    border:10px solid rgba(300, 300, 300, 0.326);
    color: #fff;
    padding: 15px;
    // min-height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    word-wrap: break-word;
    background: rgba(0, 0, 0, 0.09); 
    text-transform: Uppercase;


    p {
        text-decoration: none;
        color: #333;
        margin-top: 10px;

        &:hover {
            background-color: #1a759f;
            border-radius: 28px;
            // padding: 20px;
        }
    }


    &:hover {
        background-color: #e0fbfc;
        padding: 10px;
    }
`;

const DeleteButton = styled.button`
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: #c82333;
    }
`;

const SubjectTitle = styled.div`
    font-size: 24px;
    font-weight: bold;
    margin-top: 20px;
    color: #333;
`;

const CardLinks = styled.div`
    display: flex;
    justify-content: center;
    flex-direction:column;
    margin-top: 10px;

    a {
        flex: 1;
        text-decoration: none;
        color: #007bff;
        font-weight: bold;
        padding: 10px 0;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #f0f8ff;
        }
    }
`;

export default Subjects;