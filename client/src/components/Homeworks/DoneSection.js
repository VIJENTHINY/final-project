import React from 'react';
import styled from 'styled-components';

const DoneSection = ({ doneHomeworks, handleDeleteHomework }) => {
    return (
        <SectionContainer>
            {doneHomeworks.map(homework => (
                <StyledCard key={homework._id}>
                    <HomeworkTitle>{homework.title}</HomeworkTitle>
                    <Description>{homework.description}</Description>
                    <DueDate>Due Date: {homework.dueDate}</DueDate>
                    <DeleteButton onClick={() => handleDeleteHomework(homework._id)}>Delete</DeleteButton>
                </StyledCard>
            ))}
        </SectionContainer>
    );
};

const SectionContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px; /* Adjust the gap between cards */
`;

const StyledCard = styled.div`
    background-color: #28a745; 
    border: 2px solid #FFA000; 
    padding: 10px;
    width: 250px;
    margin: 10px;
    border-radius: 10px;
    box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1);
`;

const HomeworkTitle = styled.p`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
`;

const Description = styled.div`
    font-size: 16px;
    margin-bottom: 8px;
`;

const DueDate = styled.div`
    font-size: 14px;
    color: #6c757d; /* Gray text color */
    margin-bottom: 8px;
`;

const DeleteButton = styled.button`
    background-color: #ff0000;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
`;

export default DoneSection;