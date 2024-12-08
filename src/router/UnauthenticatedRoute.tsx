import Spinner from '@/components/Spinner';
// import { Navigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { useState } from 'react';

const UnauthenticatedRoute = () => {
    // const [isLoading, setIsLoading] = useState(false)
    const isLoading = false
    // const isAuthenticated = useSelector((state: RootState) => state.token.user);
    // const location = useLocation();

    if (isLoading) return <Spinner size='large' />;

    // const isAuthPath = location.pathname === '/login' || location.pathname === '/register';

    return (
        /*(isAuthenticated && isAuthPath) ? (
            <Navigate to="/" replace />
        ) : (*/
            <Outlet />
        //)
    );
};

export default UnauthenticatedRoute;
