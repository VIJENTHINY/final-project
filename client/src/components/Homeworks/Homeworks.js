import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useUserContext } from '../UserContext';
import SidebarAndTopNavBar from '../SideBarAndTopNavBar';
import DoingSection from './DoingSection';
import DoneSection from './DoneSection';
import TodoSection from './ToDoSection';
import Subjects from '../Subjects';
const Homeworks = () => {
    const { state: userContextState } = useUserContext();
    const [homeworks, setHomeworks] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const { subjectId } = useParams();
    const currentUser = userContextState.user;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('');
    const [doing, setDoing] = useState('');
    const [done, setDone] = useState('');



    useEffect(() => {
        fetchHomeworks();
    }, [subjectId, currentUser]);

    const fetchHomeworks = async () => {
        try {
            const response = await fetch(`/api/homeworks/?subjectId=${subjectId}&userId=${currentUser._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            const data = await response.json();
            setHomeworks(data);
        } catch (error) {
            console.error(error);
        }
    }

    const addHomework = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/homeworks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    subjectId,
                    title,
                    description,
                    dueDate,
                    status:'todo',
                }),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to save homework: ${errorMessage}`);
            }
    
            const data = await response.json();
            console.log(data);
            setHomeworks((prevHomeworks) => [...prevHomeworks, data]);
    
        } catch (error) {
            console.error(error);
        
        }
    };

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    };

    const updateHomeworkStatus = async (homeworkId, newStatus, title, description,dueDate) => {
        try {
            const response = await fetch(`/api/homeworks/${homeworkId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    subjectId,
                    title,
                    description,
                    dueDate,
                    status: newStatus }),
            });

            if (response.ok) {
                fetchHomeworks();
            } else {
                const errorMessage = await response.text();
                throw new Error(`Failed to update homework: ${errorMessage}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteHomework = async (homeworkId) => {
        try {
            const response = await fetch(`/api/homeworks/${homeworkId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (response.ok) {
                fetchHomeworks();
            } else {
                const errorMessage = await response.text();
                throw new Error(`Failed to delete homework: ${errorMessage}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <HomeworksContainer>
            <SidebarAndTopNavBar />
            <MainContent>
                    <Header>
                    <HeaderText>Homeworks</HeaderText>
                    <ButtonContainer>
                        <ShowFormButton onClick={toggleAddForm}>+</ShowFormButton> 
                    </ButtonContainer>
                </Header>
            
                <Content>
                        <TodoSectionContainer>
                    <SectionTitle>To-Do</SectionTitle>
                    <TodoSection
                    todoHomeworks={homeworks.filter(homework => homework.status === 'todo')}
                    handleHomeworkStatusChange={updateHomeworkStatus}
                    handleDeleteHomework={deleteHomework}
                    />
                </TodoSectionContainer>

                <DoingSectionContainer>
                    <SectionTitle>In Progress</SectionTitle>
                    <DoingSection
                    doingHomeworks={homeworks.filter(homework => homework.status === 'in_progress')}
                    handleHomeworkStatusChange={updateHomeworkStatus}
                    handleDeleteHomework={deleteHomework}
                    />
                </DoingSectionContainer>

                <DoneSectionContainer>
                    <SectionTitle>Done</SectionTitle>
                    <DoneSection
                    doneHomeworks={homeworks.filter(homework => homework.status === 'done')}
                    handleDeleteHomework={deleteHomework}
                    />
                </DoneSectionContainer>
                </Content>
            </MainContent>
            {showAddForm && ( 
                <PopUpContainer>
                    <PopUpContent>
                        <h3>Add New Homework</h3>
                        <Form>
                            <Input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <Textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={15}
                            />
                            <DateInput
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                            <AddButton onClick={addHomework}>Add Homework</AddButton>
                        </Form>
                        <CloseButton onClick={toggleAddForm}>Close</CloseButton>
                    </PopUpContent>
                </PopUpContainer>
            )}
        </HomeworksContainer>
    );
};

const PopUpContainer = styled.div`

    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999; 
`;

const PopUpContent = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    width: 50%;
    height: 50%;
`;

const CloseButton = styled.button`
    background-color: #ccc;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    margin-top: 10px;
    cursor: pointer;
`;


const HomeworksContainer = styled.div`
    display: flex;
`;

const MainContent = styled.main`
    flex-grow: 1;
    padding: 20px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background-color: #03045e; 
    padding: 15px; 
    color: #fff; 
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); 
`;

const HeaderText = styled.h2`
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    // margin:0 ;
`;

const Content = styled.section`
    margin-top: 20px;
`;

const TodoSectionContainer = styled.div`
    margin-bottom: 20px;
`;

const DoingSectionContainer = styled.div`
    margin-bottom: 20px;
`;

const DoneSectionContainer = styled.div`
    margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    margin-bottom: 10px;
`;

const ToDoSection = styled.section`
    margin-top: 20px;
`;

const ShowFormButton = styled.button`
    background-color: #28a745; 
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 24px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #218838; /* Darker green on hover */
    };
`;

const HomeworkItem = styled.li`
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Form = styled.form`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    
`;

const Input = styled.input`
    margin-bottom: 10px;
    padding: 10px; 
    font-size: 16px; 
    border: 1px solid #ccc;
    border-radius: 4px;
    
`;

const Textarea = styled.textarea`
    margin-bottom: 10px;
    padding-right: 100px;
    border: 1px solid #ccc;
    border-radius: 4px;

`;

const DateInput = styled.input`
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const AddButton = styled.button`
    padding: 5px 10px;
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
`;

const HomeworkDetails = styled.div`
    flex-grow: 1;
    padding: 10px;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
`;

const StatusButton = styled.button`
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
`;

const DeleteButton = styled.button`
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    color: #ff0000;
`;

export default Homeworks;