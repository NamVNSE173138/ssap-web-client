import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { GetAllNotisFromUserId, ReadNotisWithId } from '@/services/ApiServices/notification';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Badge } from 'antd';
import { formatDate } from '@/lib/date-formatter';

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const user = useSelector((state: RootState) => state.token.user);

  const [notis, setNotis] = useState<any>(null);
  const [unreadNotis, setUnreadNotis] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  const [title, setTitle] = useState("Scholarship Portal");

  const fetchNotis = async () => {
    try {
      if(!user) return;
      let majors = await GetAllNotisFromUserId(parseInt(user.id));
      setNotis(majors.data);
      let unread = majors.data.filter((noti : any) => !noti.isRead).length
      setUnreadNotis(unread);
      if(unread > 0) document.title = `(${unread}) ${title}`
      else document.title = title
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  }; 

  const readNotis = async (noti : any) => {
    try {
      if(noti.isRead) return;
      noti.isRead = true;
      let unread = notis.filter((noti : any) => !noti.isRead).length
      setUnreadNotis(unread);
      if(unread > 0) document.title = `(${unread}) ${title}`
      else document.title = title
      let res = await ReadNotisWithId(noti.id);
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
    navigator.serviceWorker.addEventListener('message', (event) => {
        fetchNotis();
    });
  }, [])


  if(!user) 
    return <></>;
   return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          <span
            className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full 
            `}
          >
            <span className="absolute -z-1 inline-flex h-full w-full rounded-full opacity-75"></span>

            <Badge className='absolute ' size='small' count={unreadNotis}/>
          </span>

          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
              fill=""
            />
          </svg>
        </Link>

        {dropdownOpen && (
          <div
            className={`absolute z-99 -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80`}
          >
            <div className="px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2">
                Notification
              </h5>
            </div>
            {notis && notis.length === 0 && <h6 className="text-lg flex justify-center font-medium text-bodydark">No notification</h6>}
            {notis && <ul className="flex h-auto flex-col overflow-y-auto">
              {notis.map((noti: any) => (
                  <li onClick={async () => await readNotis(noti) } key={noti.id}>
                      <Link to={'#'} className='flex items-center border-t border-stroke '>
                        <div
                          className="w-11/12 flex flex-col gap-2.5 px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                        >
                          <p className="text-sm">
                            <span className="text-black dark:text-white">
                                {/*noti.title*/}
                            </span>{' '}
                            {noti.message}
                          </p>

                          <p className="text-xs">{formatDate(noti.sentDate)}</p> 

                         </div>

                        {!noti.isRead && <div className='h-3 w-3 rounded-full bg-blue-500'></div>}

                       </Link>
                   </li>
               ))}
              
               {/*<li>
                 <Link
                   className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                   to="#"
                 >
                   <p className="text-sm">
                     <span className="text-black dark:text-white">
                       Edit your information in a swipe
                     </span>{' '}
                     Sint occaecat cupidatat non proident, sunt in culpa qui
                     officia deserunt mollit anim.
                   </p>

                   <p className="text-xs">12 May, 2025</p>
                 </Link>
               </li>
               <li>
                 <Link
                   className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                   to="#"
                 >
                   <p className="text-sm">
                     <span className="text-black dark:text-white">
                       It is a long established fact
                     </span>{' '}
                     that a reader will be distracted by the readable.
                   </p>

                   <p className="text-xs">24 Feb, 2025</p>
                 </Link>
               </li>
               <li>
                 <Link
                   className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                   to="#"
                 >
                   <p className="text-sm">
                     <span className="text-black dark:text-white">
                       There are many variations
                     </span>{' '}
                     of passages of Lorem Ipsum available, but the majority have
                     suffered
                   </p>

                   <p className="text-xs">04 Jan, 2025</p>
                </Link>
               </li>
               <li>
                 <Link
                   className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                   to="#"
                 >
                   <p className="text-sm">
                     <span className="text-black dark:text-white">
                       There are many variations
                     </span>{' '}
                     of passages of Lorem Ipsum available, but the majority have
                     suffered
                   </p>

                   <p className="text-xs">01 Dec, 2024</p>
                 </Link>
               </li>*/}
             </ul>}
           </div>
         )}
       </li>
     </ClickOutside>
   );
 };

export default DropdownNotification;
