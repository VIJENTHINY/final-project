import React, { useState, useEffect } from 'react';
import QuillEditor from './QuillEditor';
import SidebarAndTopNavBar from './SideBarAndTopNavBar';
import NotePopUp from './NotePopUp';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ChapterList from './ChapterList';
import NoteContent from './NoteContent';
import { useUserContext } from './UserContext'; // Import the UserContext

const NotesPage = () => {
    
    const { state: userContextState } = useUserContext();
    const [showModal, setShowModal] = useState(false);
    const [notes, setNotes] = useState([]);
    const [color, setColor] = useState('');
    const { subjectId } = useParams();
    const currentUser = userContextState.user;

    const openModal = () => {
        setSelectedNote(null);
        setShowModal(true);
    };
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch(`/api/notes/?subjectId=${subjectId}&userId=${currentUser._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });
                const data = await response.json();
                setNotes(data);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };

        if (currentUser) {
            fetchNotes();
        }
    }, [subjectId, currentUser]);


    const closeModal = () => {
        setShowModal(false);
    };



    // Function to save a new note
    const saveNote = async (noteTitle, noteContent, color) => {
        try {
            const token = localStorage.getItem("token"); // Get the token from local storage

            const response = await fetch("/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
                body: JSON.stringify({
                    subjectId,
                    title: noteTitle,
                    content: noteContent,
                    color: color,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to save note: ${errorMessage}`);
            }

            const data = await response.json();
            console.log(data);
            setNotes((prevnotes) =>[...prevnotes, { ...data, isOpen: false }]);
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    // Function to delete a note
    const handleDelete = async (noteId) => {
        try {
            const token = localStorage.getItem("token"); // Get the token from local storage

            const response = await fetch(`/api/notes/${noteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to delete note: ${errorMessage}`);
            }

            // Remove the deleted note from the notes list
            const updatedNotes = notes.filter((note) => note._id !== noteId);
            setNotes(updatedNotes);
        } catch (error) {
            console.error(error);
        }
    };
    const [selectedNote, setSelectedNote] = useState(null); // To keep track of the selected note

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    };

const [selectedChapter, setSelectedChapter] = useState(null)
    const handleSave = async (updatedNote) => {
        try {
            // Find the index of the updated note
            const updatedIndex = notes.findIndex(note => note._id === updatedNote._id);

            if (updatedIndex !== -1) {
                // Update the note in the 'notes' array
                const updatedNotes = [...notes];
                updatedNotes[updatedIndex] = updatedNote;
                setNotes(updatedNotes);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleChapterClick = (chapter) => {
        setSelectedChapter(chapter);
        setSelectedNote(null); // Clear selected note when clicking on a chapter
    };
    return (
        <Container>
            <SidebarAndTopNavBar />
            <MainContent>
                <Header>
                    <HeaderText>My Notebook</HeaderText>
                    <AddButton onClick={openModal}>+</AddButton>
                </Header>
                <ContentWrapper>
                    <ChapterList
                        notes={notes}
                        onNoteClick={handleNoteClick}
                        onDeleteChapter={handleDelete} // Pass your delete function here
                        onChapterClick={handleChapterClick}
                    />
                    <NoteContent
                        selectedNote={selectedNote}
                        onSave={handleSave} 
                    />
                </ContentWrapper>
                <NotePopUp
                    showModal={showModal}
                    closeModal={closeModal}
                    saveNote={saveNote}
                    selectedNote={selectedNote}
                    setNotes={setNotes}
                    setColor={setColor}
                    color={color}
                />
            </MainContent>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    background-color: #f8f8f8;
    font-family: 'Arial', sans-serif; 
    /* background: radial-gradient(circle at top, #85d3f9 , #e9ecc0) */
    background-color: #03045e; 
`;

const MainContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    overflow: hidden;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background-color: #03045e; 
    padding: 15px; 
    color: #fff; 
`;

const HeaderText = styled.h2`
    font-size: 28px;
    font-weight: bold;
    color: #fff;
`;

const AddButton = styled.button`
    background-color: #28a745; /* Green button color */
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
    }
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 150vh; /* Adjust as needed */
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border: 2px solid #ccc; /* Notebook border */
    padding: 20px;
    margin-top: 20px;
    font-size: 16px;
    line-height: 1.5;
    position: relative;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -20px;
        height: 100%;
        width: 20px;
        background-color: #eee; /* Left margin color */
    }
`;

export default NotesPage;