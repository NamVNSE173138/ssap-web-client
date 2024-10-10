import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { MdOutlinePerson } from 'react-icons/md';
// import { CgNotes } from 'react-icons/cg';
// import { PiClockCountdownLight } from 'react-icons/pi';
// import { FiMessageSquare } from 'react-icons/fi';
// import { FcStatistics } from 'react-icons/fc';
import { BiLogOutCircle } from 'react-icons/bi';
import { IconType } from 'react-icons';
import { AiOutlineBarChart, AiOutlineHistory, AiOutlineBook, AiOutlineAudit } from 'react-icons/ai';
import { BsChatDots } from 'react-icons/bs';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useState } from 'react';
import RouteNames from '@/constants/routeNames';
// import { useAppDispatch } from '@/store';
// import { clearAuth } from '@/store/authSlice';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useDispatch } from "react-redux";
import { removeToken, removeUser } from "@/reducers/tokenSlice";

type SidebarProps = {
    className?: string;
};

type ListItemProps = {
    Icon: IconType;
    text: string;
    link: string;
};

const ListItem = ({ Icon, text, link }: ListItemProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        navigate(link);
    };

    const isActive = location.pathname === link;

    return (
        <li onClick={handleClick} className={`lg:px-12 px-5 gap-4 transition-colors w-full py-2 cursor-pointer duration-200 hover:bg-blue-400 group rounded-lg ${isActive && 'bg-blue-300 text-white'}`}>
            <div className='flex justify-start items-center gap-8'>
                <Icon size={24} className='text-[#067CEB] group-hover:text-white duration-200 transition-colors' />
                <Link to={link} className='lg:text-[#067CEB] text-[#2968a4] lg:text-lg text-xl group-hover:text-white'>{text}</Link>
            </div>
        </li>
    );
};

const listItems: ListItemProps[] = [
    { Icon: AiOutlineAudit, text: 'Tài khoản', link: RouteNames.ACCOUNT_INFO},
    { Icon: AiOutlineBook, text: 'Hoạt động', link: ""},
    { Icon: AiOutlineHistory, text: 'Lịch sử', link: ""},
    { Icon: BsChatDots, text: 'Chat', link: ""},
    { Icon: AiOutlineBarChart, text: 'Thống kê', link: ""},
    // { Icon: BiLogOutCircle, text: 'Đăng xuất', link: RouteNames.HOME},
];

const Sidebar = ({ className }: SidebarProps) => {
    const isAboveMediumScreens = useMediaQuery('(min-width: 1060px)');
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    // const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const handleLogout = () => {
    //     // dispatch(clearAuth());
    //     localStorage.removeItem('token');
    //     navigate(RouteNames.HOME);
    // };
    const handleLogout = () => {
        // setIsLoading(true); 
        setTimeout(() => {
          dispatch(removeToken()); 
          dispatch(removeUser());  
          localStorage.removeItem('token'); 
          navigate(RouteNames.HOME); 
        //   setIsLoading(false); 
        }, 500); 
      };

    return (
        // <div className={`${className} flex flex-col justify-between py-8`}>
        //     <div className='flex flex-col items-center gap-8'>
        //         <div className='flex justify-center items-center gap-4'>
        //             <img src='https://via.placeholder.com/150' alt='profile' className='rounded-full w-24' />
        //             <div className='text-black flex flex-col gap-2'>
        //                 <h1>Tài khoản</h1>
        //                 <div className='flex justify-between items-center cursor-pointer gap-2'>
        //                     <BsPencilSquare size={20} color='white' />
        //                     <p className='text-sm'>Sửa hồ sơ</p>
        //                 </div>
        //             </div>
        //         </div>
        //         <div className='h-[1px] bg-gray-100 w-2/3'></div>
        //         <menu className='w-full flex flex-col'>
        //             {listItems.map((item, index) => (
        //                 <ListItem key={index} Icon={item.Icon} text={item.text} link={item.link} />
        //             ))}
        //             {/* <div className='flex justify-center items-center gap-4 hover:bg-[#36D1FF] py-2 cursor-pointer mb-24'>
        //                 <BiLogOutCircle size={32} color='blue' />
        //                 <button className='text-lg text-blue-500'>Đăng xuất</button>
        //             </div> */}
        //         </menu>
        //     </div>

        // </div>
        <>
            <div className={`${className} flex flex-col py-10 border-r-2 `}>
                <div className='flex flex-col items-center gap-8'>
                    {/* <div className='flex justify-center items-center gap-4'>
                        <img src='https://via.placeholder.com/150' alt='profile' className='rounded-full w-24' />
                        
                    </div> */}
                    <div className='h-[1px] bg-gray-100 w-2/3'></div>
                </div>
                {isAboveMediumScreens ? (
                    <menu className='w-full flex flex-col'>
                        {listItems.map((item, index) => (
                            <ListItem key={index} Icon={item.Icon} text={item.text} link={item.link} />
                        ))}
                        <li className='lg:px-12 px-5 gap-4 transition-colors w-full py-2 cursor-pointer duration-200 hover:bg-blue-400 group rounded-lg'>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <div className='flex justify-start items-center gap-8'>
                                        <BiLogOutCircle size={24} className='text-[#067CEB] group-hover:text-white duration-200 transition-colors' />
                                        <p className='lg:text-[#067CEB] text-[#2968a4] lg:text-lg text-xl group-hover:text-white'>Đăng xuất</p>
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Bạn có chắc chắn muốn đăng xuất?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Đăng xuất sẽ đưa bạn trở lại trang
                                            đăng nhập
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Hủy
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </li>
                    </menu>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, x: 0 },
                            visible: { opacity: 1, x: 20 },
                        }}>
                        <button
                            className="rounded-full h-full bg-blue-500 p-2"
                            onClick={() => setIsMenuToggled(!isMenuToggled)}
                        >
                            <Bars3Icon className="h-6 w-6 text-white" />
                        </button>
                    </motion.div>)}

                {!isAboveMediumScreens && isMenuToggled && (
                    <div className="fixed left-0 bottom-0 z-40 h-full w-[50%] bg-blue-400 shadow drop-shadow-xl">
                        {/* CLOSE ICON */}
                        <div className="flex justify-end p-12">
                            <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
                                <XMarkIcon className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        {/* MENU ITEMS */}
                        <div className="">
                            <div className='flex justify-center items-center gap-4 mb-5'>
                                <img src='https://via.placeholder.com/150' alt='profile' className='rounded-full w-24' />
                            </div>
                            <ul className="flex justify-around flex-col gap-10">
                                {listItems.map((item) => (
                                    <ListItem key={item.link} Icon={item.Icon} text={item.text} link={item.link} />
                                ))}
                                <li onClick={handleLogout} className='lg:px-12 px-5 gap-4 transition-colors w-full py-2 cursor-pointer duration-200 hover:bg-blue-400 group'>
                                    <div className='flex justify-start gap-8'>
                                        <BiLogOutCircle size={24} className='text-[#067CEB] group-hover:text-white duration-200 transition-colors' />
                                        <p className='lg:text-[#067CEB] text-[#2968a4] lg:text-lg text-xl group-hover:text-white'>Đăng xuất</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Sidebar;
