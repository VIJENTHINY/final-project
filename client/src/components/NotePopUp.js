import React, { useState } from 'react';
import styled from 'styled-components';
import QuillEditor from './QuillEditor';

// notes : state: [{title: , content: }]

const NotePopUp = ({ showModal, closeModal, saveNote, setNotes, setColor, color }) => {
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    

    const handleSaveNote = () => {
        console.log(noteContent);
        const targetContent = noteContent.replace(/(<([^>]+)>)/ig,"")
        
        console.log(targetContent);
        saveNote( noteTitle, targetContent, color); 
        const obj = {title: noteTitle, content: targetContent};
        console.log()
        // setNotes((prev) => [...prev, obj]);

    };

    const handleColorChange = (e) => {
        console.log(e.target.value);
        setColor(e.target.value);
    }



    return (
        showModal && (
            <Modal>
                <ModalContent>
                    <TitleInput
                        placeholder="Enter Note Title"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                    />
                    <QuillEditorContainer>
                        <QuillEditor 
                        value={noteContent} 
                        onChange={setNoteContent} />
                    </QuillEditorContainer>

                    <ButtonColorComp>
                    <ColorsDiv onChange={(e) => {handleColorChange(e)}}>
                        <Input type="radio" name="color-pick" value="#F06292" id="color1" />
                        <Label htmlFor="color1" style={{backgroundColor: "#F06292"}}></Label>
                        <Input type="radio" name="color-pick" value="#BA68C8" id="color2" />
                        <Label htmlFor="color2" style={{backgroundColor: "#BA68C8"}}></Label>
                        <Input type="radio" name="color-pick" value="#ffcad4" id="color3" />
                        <Label htmlFor="color3" style={{backgroundColor: "#ffcad4"}}></Label>
                        <Input type="radio" name="color-pick" value="#4FC3F7" id="color4" />
                        <Label htmlFor="color4" style={{backgroundColor: "#4FC3F7"}}></Label>
                        <Input type="radio" name="color-pick" value="#AED581" id="color5" />
                        <Label htmlFor="color5" style={{backgroundColor: "#AED581"}}></Label>
                    
                    </ColorsDiv>
                    <ButtonGroup>
                        <SaveButton onClick={handleSaveNote}>Save Note</SaveButton>
                        <CloseButton onClick={closeModal}>Close</CloseButton>
                    </ButtonGroup>
                    </ButtonColorComp>
                    
                </ModalContent>
            </Modal>
        )
    );
};

// Styled components
const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: #fffafb;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.4);
    width: 50%;
    max-height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 1px 3px;

`;

const TitleInput = styled.input`
    width: auto;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    
   
`;

const Input = styled.input`
    visibility: hidden;
    width: 0;
    margin: 0;
`;

const Label = styled.label`
    display: inline-block;
    padding: 17px;
    border-radius: 50%;
    margin-right: 5px;
    position: relative;
    cursor: pointer;
`;

const QuillEditorContainer = styled.div`
    width: 100%;
    margin-bottom: 10px;
`;

const ButtonColorComp = styled.div`
    display: flex;
    justify-content: flex-start;
    justify-content:space-between;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ColorsDiv = styled.div`
    display: flex;
    justify-content: flex-start;
    width: 100px;
    position: relative;
   
    
`;

const SaveButton = styled.button`
    background-color: #44c767;
    color: #fff;
    border: none;
    border-radius: 28px;
    padding: 8px 16px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
        background-color:#5cbf2a;
    }
    
`;

const CloseButton = styled.button`
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 28px;
    padding: 8px 16px;
    cursor: pointer;
`;

export default NotePopUp;