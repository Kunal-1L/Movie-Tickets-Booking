import { createContext, useState } from "react";

const GlobalContext = createContext();

const GlobalState = ({children}) => {
    const [login, setLogin] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [bookingAvailable, setBooking] = useState(false);
    return (
        <GlobalContext.Provider value={{login, setLogin, showForm, setShowForm, bookingAvailable, setBooking}}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext, GlobalState };
