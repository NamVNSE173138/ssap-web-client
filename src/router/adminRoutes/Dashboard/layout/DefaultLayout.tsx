import React, { useState, ReactNode, useEffect } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useToast } from '@/components/ui/use-toast';
import { requestNotify } from '@/services/requestNotify';

// const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state: RootState) => state.token.user);
    //const unread = useSelector((state: RootState) => state.unreadNotify.unreadNotify);
    const {toast} = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if(user != null)
            requestNotify(user.id);
        navigator.serviceWorker.addEventListener('message', (event) => {
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
        });
    }, [user]);



  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet/>
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
