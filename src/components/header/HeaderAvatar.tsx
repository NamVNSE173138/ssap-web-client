import { LogOut } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
// import { useAppDispatch } from '@/store';
// import { clearAuth } from '@/store/authSlice';
import { useState } from 'react';
import ScreenSpinner from '../ScreenSpinner';
import RouteNames from '@/constants/routeNames';
import { removeToken, removeUser } from "@/reducers/tokenSlice";
import { useDispatch } from "react-redux";
import { CgProfile } from "react-icons/cg";
import Profile from '@/router/adminRoutes/Dashboard/pages/Profile';

const HeaderAvatar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        setIsLoading(true); 
        setTimeout(() => {
          dispatch(removeToken()); 
          dispatch(removeUser());  
          localStorage.removeItem('token'); 
          navigate(RouteNames.HOME); 
          setIsLoading(false); 
        }, 500); 
      };

    const handleProfileClick = () => {
        navigate(RouteNames.ACCOUNT_INFO);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem  onClick={handleProfileClick}>
                        <CgProfile className='mr-2'/> Profile</DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <div className="flex items-center px-2 text-sm">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    You wanna log out?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Log out will redirect you to Home Page
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleLogout}
                                >
                                    Log out
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
            {isLoading && <ScreenSpinner />}
        </>
    );
};

export default HeaderAvatar;