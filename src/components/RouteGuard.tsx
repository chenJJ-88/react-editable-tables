import React from 'react';
import { Route, RouteProps, Navigate } from 'react-router-dom';

interface RouteGuardProps extends Omit<RouteProps, 'element'> {
    guard: (to: unknown, from: unknown, next: () => void) => void;
    children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ guard, children, ...rest }) => {
    debugger
    const [canAccess, setCanAccess] = React.useState(false);

    React.useEffect(() => {
        // guard(
        //     { pathname: window.location.pathname },
        //     { pathname: document.referrer },
        //     () => setCanAccess(true)
        // );
        const isAuthenticated = localStorage.getItem('token') !== null;
        setCanAccess(isAuthenticated);
    }, []);

    if (!canAccess) {
        return <Navigate to="/login" replace />;
    }

    return <Route {...rest} element={children} />;
};

export default RouteGuard;

