import Logo from "../logo";
import Navigation from "./Navigation";
import RouteNames from "../../constants/routeNames";
import navigation from "../../constants/multilingual/navigation";
import AuthNavigation from "./AuthNavigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { removeToken, removeUser } from "@/reducers/tokenSlice";

const Header = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeToken());
    dispatch(removeUser());
  };
  return (
    <header
      className="flex justify-around items-center p-1 "
      style={{ backgroundColor: "#BBD4EA" }}
    >
      <Logo />
      <div className="flex justify-between items-center">
        <Navigation />
        {/* <div className="flex justify-between gap-8">
                    {(!isLoading && !isAuthenticated)
                        ? (
                            <div className="flex justify-center">
                                <AuthNavigation to={RouteNames.LOGIN} text={t(navigation.LOGIN)} />
                                <p>/</p>
                                <AuthNavigation to={RouteNames.REGISTER} text={t(navigation.REGISTER)} />
                            </div>
                        )
                        : shouldNotShowNavigation
                            ? <HeaderAvatar />
                            : <></>
                    }
          </div> */}
        {user &&
          <div className="flex justify-between gap-8">
            <div className="flex justify-center ml-9 p-2 rounded-xl" style={{backgroundColor: "#5559C7"}}>
              <p className="text-xl text-white">Hello {user.username}</p>
              <p className="text-xl text-white">/</p>
              <div className='flex flex-col'>
                <div onClick={handleLogout} className='peer/login text-xl text-white font-normal cursor-pointer'>Logout</div>
                <div className='w-full h-[2px] bg-white scale-x-0 peer-hover/login:scale-x-100 transition' />
                </div>            
              </div>
          </div>
        }
        {!user &&
          <div className="flex justify-between gap-8">
            <div className="flex justify-center ml-9 p-2 rounded-xl" style={{backgroundColor: "#5559C7"}}>
              <AuthNavigation to={RouteNames.LOGIN} text={navigation.LOGIN} />
              <p className="text-xl text-white">/</p>
              <AuthNavigation to={RouteNames.REGISTER} text={navigation.REGISTER} />
            </div>
          </div>
        }
      </div>
    </header>
  );
};

export default Header;
