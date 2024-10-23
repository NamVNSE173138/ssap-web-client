import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../../components/header/index';
import Footer from '../../components/footer/index';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { requestNotify } from '@/services/requestNotify';
import { useToast } from "@/components/ui/use-toast";

const ClientLayout = () => {
    const user = useSelector((state: RootState) => state.token.user);
    //const unread = useSelector((state: RootState) => state.unreadNotify.unreadNotify);
    const {toast} = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if(user != null)
            requestNotify(user.id);
        navigator.serviceWorker.addEventListener('message', (event) => {
            if(event.data.notification){
                toast({
                    title: event.data.notification.title,
                    description: event.data.notification.body,
                    duration: 5000,
                    variant: 'default',
                    onClickCapture: () => {
                        navigate(event.data.data.link);
                        //console.log("decrementUnread");
                    },
                });
            }
        });
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
