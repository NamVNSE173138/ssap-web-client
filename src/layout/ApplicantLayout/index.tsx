import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/header/index';
import Footer from '../../components/footer/index';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { requestNotify } from '@/services/requestNotify';
import { useToast } from "@/components/ui/use-toast";
import { NotifyNewUser } from '@/services/ApiServices/notification';

const ClientLayout = () => {
    const user = useSelector((state: RootState) => state.token.user);
    //const unread = useSelector((state: RootState) => state.unreadNotify.unreadNotify);
    const {toast} = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { sendNotification } = location.state || {sendNotification:false};

    const notify = async () => {
        if(user != null){
            await requestNotify(user.id);
            if(sendNotification) await NotifyNewUser(parseInt(user.id));
        }
    }

    useEffect(() => {
        notify();
        
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
