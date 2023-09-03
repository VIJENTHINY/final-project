    export const initialState = {
        user: null,
        loading: true,
    };
    
    export const userReducer = (state, action) => {
        switch (action.type) {
        case 'SET_USER':
            return {
            ...state,
            user: action.payload,
            loading: false,
            };
        case 'LOGOUT':
            return {
            ...state,
            user: null,
            loading: false,
            };
        case 'INITIALIZE':
            return {
            ...state,
            loading: action.payload.loading,
            };
        default:
            return state;
        }
    };