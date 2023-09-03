import React, { createContext, useContext, useReducer } from 'react';
import { initialState, userReducer } from './userReducer';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
        {children}
        </UserContext.Provider>
    );
};

export default UserProvider;