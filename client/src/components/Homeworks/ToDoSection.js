import React from 'react';
import styled from 'styled-components';

const ToDoSection = ({ todoHomeworks, handleHomeworkStatusChange, handleDeleteHomework }) => {
    return (
        <SectionContainer>
            {todoHomeworks.map(homework => (
                <StickyNote key={homework._id}>
                    <HomeworkTitle>{homework.title}</HomeworkTitle>
                    <NoteContent>
                        <div>{homework.description}</div>
                        <div>Due Date: {homework.dueDate}</div>
                    </NoteContent>
                    <ButtonContainer>
                        <StartButton onClick={() => handleHomeworkStatusChange(homework._id, 'in_progress', homework.title, homework.description, homework.dueDate)}>
                            Move to Doing
                        </StartButton>
                        <DeleteButton onClick={() => handleDeleteHomework(homework._id)}>Delete</DeleteButton>
                    </ButtonContainer>
                </StickyNote>
            ))}
        </SectionContainer>
    );
};

const SectionContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const StickyNote = styled.div`
    background-color: lightblue;
    border: 2px solid #e6ac00;
    padding: 10px;
    width: 250px;
    margin: 10px;
    border-radius: 10px;
    box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1);
`;

const HomeworkTitle = styled.h3`
    font-size: 16px;
    font-weight: bold;
`;

const NoteContent = styled.div`
    margin: 10px 0;
    font-size: 14px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StartButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
`;

const DeleteButton = styled.button`
    background-color: #ff0000;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
`;

export default ToDoSection;