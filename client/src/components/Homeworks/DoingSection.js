import React from 'react';
import styled from 'styled-components';

const DoingSection = ({ doingHomeworks, handleHomeworkStatusChange, handleDeleteHomework }) => {
    return (
        <SectionContainer>
            {doingHomeworks.map(homework => (
                <StyledCard key={homework._id}>
                    <HomeworkTitle>{homework.title}</HomeworkTitle>
                    <NoteContent>
                        <div>{homework.description}</div>
                        <div>Due Date: {homework.dueDate}</div>
                    </NoteContent>
                    <ButtonContainer>
                        <MarkAsDoneButton onClick={() => handleHomeworkStatusChange(homework._id, 'done', homework.title, homework.description, homework.dueDate)}>
                            Mark as Done
                        </MarkAsDoneButton>
                        <DeleteButton onClick={() => handleDeleteHomework(homework._id)}>Delete</DeleteButton>
                    </ButtonContainer>
                </StyledCard>
            ))}
        </SectionContainer>
    );
};

const SectionContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const StyledCard = styled.div`
    background-color: #ffc109; 
    border: 2px solid #FFA000; 
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

const MarkAsDoneButton = styled.button`
    background-color: #007bff;
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

export default DoingSection;