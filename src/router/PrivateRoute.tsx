// import Spinner from '@/components/Spinner';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { setCallback } from '@/store/callbackSlice';
// import { useEffect } from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import NotFound from "./commonRoutes/404";

const PrivateRoute = ({ role }: { role: string[] }) => {
    // const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    // const dispatch = useAppDispatch();
    // const location = useLocation();
    // useEffect(() => {
    //     if (!isAuthenticated) 
    //         dispatch(setCallback(location.pathname));
    // }, [isAuthenticated, isLoading, dispatch, location]);

    // if (isLoading) return <Spinner size='large' />;

    // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
    
    const user = useSelector((state: RootState) => state.token.user);
    if(!user) return <Navigate to="/login" replace />
    if(!role.includes(user?.role)) return <NotFound />
    return <Outlet />
};

export default PrivateRoute;
