import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header/index";
import Footer from "../../components/footer/index";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { requestNotify } from "@/services/requestNotify";
import { useToast } from "@/components/ui/use-toast";
import { NotifyNewUser } from "@/services/ApiServices/notification";
import { getMessaging, onMessage } from "firebase/messaging";

const ClientLayout = () => {
  const user = useSelector((state: RootState) => state.token.user);
  //const unread = useSelector((state: RootState) => state.unreadNotify.unreadNotify);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { sendNotification } = location.state || { sendNotification: false };
  const messaging = getMessaging();

  const notify = async () => {
    if (user != null) {
      await requestNotify(user.id);
      if (sendNotification) await NotifyNewUser(parseInt(user.id));
    }
  };

  useEffect(() => {
    notify();
    const playNotificationSound = () => {
      const audio = new Audio("/noti-sound.mp3");
      audio.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    };

    //get notification when app is active
    onMessage(messaging, (payload: any) => {
      if (
        payload.data.messageType != "push-received" &&
        payload.data.topic == user?.id
      ) {
        playNotificationSound(); // Play sound when a notification is received
      }
    });
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.notification && event.data.data.topic == user?.id) {
        playNotificationSound();
        toast({
          title: event.data.notification.title,
          description: event.data.notification.body,
          duration: 5000,
          variant: "default",
          onClickCapture: () => {
            navigate("/");
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
