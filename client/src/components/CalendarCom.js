import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SidebarAndTopNavBar from './SideBarAndTopNavBar';
import styled from 'styled-components';


const CalendarCom = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState('');
    const [starredDates, setStarredDates] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        fetchEventsForDate(date);
    }, [date]);

    const fetchEventsForDate = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/events/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            const eventDates = data.map(event => event.date);
            setStarredDates(eventDates);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const filteredEvents = events.filter(event => event.date === date.toDateString());

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        if (date < new Date()) {
            setErrorMessage("Cannot add events for past dates.");
            return;
        }
        try {
            const token = localStorage.getItem("token"); // Retrieve the token from local storage
            
            const response = await fetch('/api/events/create-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    date: date.toDateString(), // Convert date to a string format
                    event: newEvent,
                }),
            });

            if (response.ok) {
                setNewEvent('');
                fetchEventsForDate();
            } else {
                console.error('Failed to create event');
            }
            setErrorMessage('');
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/events/delete-event/${eventId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                fetchEventsForDate();
            } else {
                console.error('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && starredDates.includes(date.toDateString())) {
            return <StarIcon>⭐</StarIcon>;
        } else {
            return null;
        }
    };

    return (
        <Container>
            <SidebarAndTopNavBar />
            <MainContent>
                <Header>
                    <HeaderText>Calendar</HeaderText>
                </Header>
                <Content>
                <StyledCalendar
    onChange={setDate}
    value={date}
    calendarType="US"
    tileContent={tileClassName}
        
/>
<EventForm onSubmit={handleEventSubmit}>
    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                        <input
                            type="text"
                            placeholder="New Event"
                            value={newEvent}
                            onChange={(e) => setNewEvent(e.target.value)}
                        />
                        <SubmitButton type="submit">
                            Add Event
                        </SubmitButton>
                    </EventForm>
                    <EventList>
                        <h2>Events for {date.toDateString()}:</h2>
                        <ul>
                        {filteredEvents.map((event) => (
                                <EventListItem key={event._id}>
                                    <EventText>{event.event}</EventText>
                                    <DeleteButton onClick={() => deleteEvent(event._id)}>Delete</DeleteButton>
                                </EventListItem>
))}
                        </ul>
                    </EventList>
                </Content>
            </MainContent>
        </Container>
    );
};


const DeleteButton = styled.button`
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    margin-left: 10px; 
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #d63737;
    }
`;
const EventListItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

const EventText = styled.span`
    flex: 1;
`;
const StarIcon = styled.span`
    display: block;
    text-align: center;
    color: gold; // Customize the color of the star icon
`;
const ErrorMessage = styled.p`
    color: red;
    margin-bottom: 10px;
`;
const StyledCalendar = styled(Calendar)`
    width: 80%; /* Adjust the width as needed */
    max-width: 800px; /* Set a maximum width if desired */
    margin: 0 auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #fff;
    padding: 20px;

    /* Styles for calendar headers */
    .react-calendar__navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .react-calendar__navigation button {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
    }

    /* Style for calendar days */
    .react-calendar__month-view__weekdays {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        margin-bottom: 10px;
    }
    

    /* Style for calendar cells */
    .react-calendar__tile {
        padding: 0.5em;
        text-align: center;
        font-size: 14px;
        transition: background-color 0.3s;
    }
    .react-calendar__tile:hover {
        background-color: #f0f0f0;
        cursor: pointer;
    }
    .react-calendar__tile--active {
        background-color: #007bff;
        color: #fff;
    }

`;

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background: radial-gradient(circle at top, #85d3f9 , #e9ecc0)
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
`;

const MainContent = styled.div`
    flex: 1;
    padding: 20px;
`;

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content:center;
    flex-direction:column;
`;

const EventForm = styled.form`
    display: flex;
    flex-direction: column;
    margin: 20px;
    

    input {
        padding: 8px;
        margin-bottom: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
`;

const SubmitButton = styled.button`
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const EventList = styled.div`
    margin-left: 20px;

    h2 {
        font-size: 18px;
        margin-bottom: 10px;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            margin-bottom: 5px;
        }
    }
`;

export default CalendarCom;