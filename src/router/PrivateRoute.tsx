// import Spinner from '@/components/Spinner';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { setCallback } from '@/store/callbackSlice';
// import { useEffect } from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
    // const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    // const dispatch = useAppDispatch();
    // const location = useLocation();
    // useEffect(() => {
    //     if (!isAuthenticated) 
    //         dispatch(setCallback(location.pathname));
    // }, [isAuthenticated, isLoading, dispatch, location]);

    // if (isLoading) return <Spinner size='large' />;

    // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
    return (
        <>
            <div>Private Route</div>
        </>
    )
};

export default PrivateRoute;
