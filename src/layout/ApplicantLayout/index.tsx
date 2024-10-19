import { Outlet } from 'react-router-dom';
import Header from '../../components/header/index';
import Footer from '../../components/footer/index';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { requestNotify } from '@/services/requestNotify';

const ClientLayout = () => {
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


    return (
        <>
            <div className="flex flex-col justify-between h-screen">
                <Header />
                <Outlet />
                <Footer />
            </div>
        </>
    );
};

export default ClientLayout;
