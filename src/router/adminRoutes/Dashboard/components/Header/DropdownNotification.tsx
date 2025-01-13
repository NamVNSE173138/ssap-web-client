import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClickOutside from "../ClickOutside";
import {
  GetAllNotisFromUserId,
  ReadNotisWithId,
} from "@/services/ApiServices/notification";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Badge } from "antd";
import { formatDate } from "@/lib/date-formatter";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";
import { getMessaging, onMessage } from "firebase/messaging";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [_notifying, setNotifying] = useState(true);

  const user = useSelector((state: RootState) => state.token.user);

  const [notis, setNotis] = useState<any>(null);
  const [unreadNotis, setUnreadNotis] = useState<number>(0);
  const [_errorMessage, setErrorMessage] = useState<any>(null);

  // const [title, setTitle] = useState("Scholarship Portal");
  const title = "Scholarship Portal";

  const messaging = getMessaging();

  const fetchNotis = async () => {
    try {
      if (!user) return;
      let majors = await GetAllNotisFromUserId(parseInt(user.id));
      setNotis(majors.data);
      let unread = majors.data.filter((noti: any) => !noti.isRead).length;
      setUnreadNotis(unread);
      if (unread > 0) document.title = `(${unread}) ${title}`;
      else document.title = title;
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      // Mark all notifications as read
      const updatedNotis = notis.map((noti: any) => {
        if (!noti.isRead) {
          noti.isRead = true;
          ReadNotisWithId(noti.id); // Optional: Call API to mark as read
        }
        return noti;
      });

      // Update the state with updated notifications
      setNotis(updatedNotis);

      // Update unread notifications count
      const unreadCount = updatedNotis.filter(
        (noti: any) => !noti.isRead
      ).length;
      setUnreadNotis(unreadCount);

      // Update document title
      if (unreadCount > 0) {
        document.title = `(${unreadCount}) ${title}`;
      } else {
        document.title = title;
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  };

  const readNotis = async (noti: any) => {
    try {
      if (noti.isRead) return;
      noti.isRead = true;
      let unread = notis.filter((noti: any) => !noti.isRead).length;
      setUnreadNotis(unread);
      if (unread > 0) document.title = `(${unread}) ${title}`;
      else document.title = title;
      await ReadNotisWithId(noti.id);
      //await fetchNotis();
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchNotis();

    const unsubscribeOnMessage = onMessage(messaging, (payload: any) => {
      if (
        payload.data.messageType != "push-received" &&
        payload.data.topic == user?.id
      ) {
        fetchNotis();
      }
    });
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.notification && event.data.data.topic == user?.id) {
        fetchNotis();
      }
    });
    return () => {
      navigator.serviceWorker.removeEventListener("message", (event) => {
        if (event.data.notification && event.data.data.topic == user?.id) {
          fetchNotis();
        }
      });
      unsubscribeOnMessage();
    };
  }, []);

  if (!user) return <></>;
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-gray-100 hover:bg-blue-200 transition-all duration-300 ease-in-out"
        >
          <IoIosNotifications className="text-2xl text-gray-600" />
          <Badge
            className="absolute top-0 right-0"
            size="small"
            count={unreadNotis}
          />
        </Link>

        {dropdownOpen && (
          <div className="absolute z-50 right-0 mt-2.5 w-72 rounded-lg shadow-lg bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h5 className="text-lg font-semibold text-black dark:text-white">
                Notifications
              </h5>
            </div>

            {notis && notis.length === 0 ? (
              <h6 className="text-center text-gray-500 text-md py-4">
                No notifications
              </h6>
            ) : (
              <ul className="max-h-80 overflow-y-auto">
                {notis.map((noti: any) => (
                  <li
                    onClick={async () => await readNotis(noti)}
                    key={noti.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <Link
                      to="#"
                      className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700"
                    >
                      <IoIosNotificationsOutline className="text-lg text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm text-black dark:text-white">
                          <span className="font-semibold">{noti.title}</span> -{" "}
                          {noti.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          {formatDate(noti.sentDate)}
                        </p>
                      </div>
                      {!noti.isRead && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClearAllNotifications}
                className="w-full py-2 text-sm text-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300"
              >
                Clear All Notifications
              </button>
            </div>
          </div>
        )}
      </>
    </ClickOutside>
  );
};

export default DropdownNotification;
