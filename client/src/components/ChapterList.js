import React from 'react';
import styled from 'styled-components';

const ChapterList = ({ notes, onNoteClick, onDeleteChapter}) => {
    // console.log("color is: " + color);
    console.log("rerender the Chapterlist Component" + JSON.stringify(notes));
    // automartically
    console.log(notes);
    return (
        <Container>
            <Div>Title</Div>
            {/* value : isopne: false: return result.. isOpen */}
            {notes.map(note => (
                
                <ChapterItem style={{backgroundColor:note.color}} key={note._id} onClick={() => onNoteClick(note)}>
                    { note.title}
                    {/* { note.title} */}
                    <DeleteButton onClick={(event) => {
                        event.stopPropagation(); 
                        onDeleteChapter(note._id);
                    }}>Delete</DeleteButton>
                </ChapterItem>
            ))}
        </Container>
    );
}


const Container = styled.div`
    width:250px;
    padding: 20px;
    border-right: 1px solid #ccc;
    height: 50vh;

`;
const Div= styled.div`
    font-weight: bold;
    font-size: 20px;
`
const ChapterItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    font-weight: bold;
    cursor: pointer;
    overflow: hidden;
    margin: 10px 0;
    opacity: 0.6;
    &:hover {
        background-color: #f0f0f0;
    }
`;

const ChapterTitle = styled.span`
    font-size: 16px;
    font-weight: bold;
    color: #333;
`;


const DeleteButton = styled.button`
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 4px 8px;
    cursor: pointer;
    margin-left: 10px;
    font-size: 12px;

    &:hover {
        background-color: #c82333;
    }
`;


export default ChapterList;
