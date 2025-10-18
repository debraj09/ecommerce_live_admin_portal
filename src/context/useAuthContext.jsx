import {createContext, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';

const AuthContext = createContext(undefined);

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

const authSessionKey = '_UBOLD_AUTH_KEY_';

export function AuthProvider({
                                 children
                             }) {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies([authSessionKey]);
    const getSession = () => {
        const fetchedCookie = cookies[authSessionKey];
        if (!fetchedCookie) return; else return fetchedCookie;
    };
    const [user, setUser] = useState(getSession());
    const saveSession = user => {
        setCookie(authSessionKey, user);
        setUser(user);
    };
    const removeSession = () => {
        removeCookie(authSessionKey);
        setUser(undefined);
        navigate('/auth/login');
    };
    return <AuthContext.Provider value={{
        user,
        isAuthenticated: !!cookies[authSessionKey],
        saveSession,
        removeSession
    }}>
        {children}
    </AuthContext.Provider>;
}