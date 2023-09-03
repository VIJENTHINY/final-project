import React, { useState, useEffect } from 'react';
import QuillEditor from './QuillEditor';
import styled from 'styled-components';

const NoteContent = ({ selectedNote, onSave }) => {
    const [editedContent, setEditedContent] = useState('');
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    useEffect(() => {
        setEditedContent(selectedNote ? selectedNote.content : '');
        setShowSavedMessage(false);
    }, [selectedNote]);

    const handleSave = async () => {
        try {
            const targetContent = editedContent.replace(/(<([^>]+)>)/ig,'');
            
            const token = localStorage.getItem("token"); // Retrieve the token from local storage
            
            const response = await fetch(`/api/notes/${selectedNote._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add the token to the headers
                },
                body: JSON.stringify({
                    title: selectedNote.title,
                    content: targetContent,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update note: ${errorMessage}`);
            }

            const updatedNote = { ...selectedNote, content: editedContent };
            onSave(updatedNote);

            setShowSavedMessage(true);
            setTimeout(() => {
                setShowSavedMessage(false);
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            {selectedNote && (
                <ContentContainer>
                    <QuillEditorContainer>
                        <QuillEditor value={editedContent} onChange={setEditedContent} />
                        <ButtonContainer>
                            <SaveButton onClick={handleSave}>Save</SaveButton>
                            {showSavedMessage && <SavedMessage>Saved</SavedMessage>}
                        </ButtonContainer>
                    </QuillEditorContainer>
                </ContentContainer>
            )}
        </Container>
    );
};


const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
`;

const ClearButton = styled.button`
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    cursor: pointer;
    margin-left: 10px;

    &:hover {
        background-color: #c82333;
    }
`;

const SavedMessage = styled.div`
    color: #28a745;
    font-size: 14px;
    margin-top: 5px;
`;

const Container = styled.div`
    flex: 1;
    padding: 0 20px;
`;

const ContentContainer = styled.div`
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 10px 0;
`;

const QuillEditorContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const SaveButton = styled.button`
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    cursor: pointer;
    margin-top: 10px;
`;

export default NoteContent;