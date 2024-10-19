import { requestNotify } from '@/services/requestNotify';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const NoLayout = () => {
    const user = useSelector((state: RootState) => state.token.user);

    /*onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
    });*/
    navigator.serviceWorker.addEventListener('message', (event) => {
        console.log(event.data);
    });
    useEffect(() => {
        if(user != null)
            requestNotify(user.id);
    }, [user]);
    return <Outlet />;
};

export default NoLayout;
