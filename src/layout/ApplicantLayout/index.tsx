import { Outlet } from 'react-router-dom';
import Header from '../../components/header/index';
import Footer from '../../components/footer/index';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { requestNotify } from '@/services/requestNotify';
import { useToast } from "@/components/ui/use-toast";
import { decrementUnread, incrementUnread } from '@/reducers/unreadNotifySlice';

const ClientLayout = () => {
    const user = useSelector((state: RootState) => state.token.user);
    //const unread = useSelector((state: RootState) => state.unreadNotify.unreadNotify);
    const {toast} = useToast();
    const dispatch = useDispatch();

    useEffect(() => {
        if(user != null)
            requestNotify(user.id);
        navigator.serviceWorker.addEventListener('message', (event) => {
            dispatch(incrementUnread());
            toast({
                title: event.data.notification.title,
                description: event.data.notification.body,
                duration: 5000,
                variant: 'default',
                onOpenChange: (open) => {
                    if (!open) {
                        dispatch(decrementUnread());
                        console.log("decrementUnread");
                    }
                }
            });
        });
    }, []);


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
