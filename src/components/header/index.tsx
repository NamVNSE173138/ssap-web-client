import Logo from "../logo";
import Navigation from "./Navigation";
import RouteNames from "../../constants/routeNames";
import navigation from "../../constants/multilingual/navigation";
import AuthNavigation from "./AuthNavigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import HeaderAvatar from "./HeaderAvatar";

const Header = () => {
  const user = useSelector((state: RootState) => state.token.user);

  
  return (
    <header
      className="flex justify-around items-center p-1 "
      style={{ backgroundColor: "#1eb2a6" }}
    >
      <Logo />
      <div className="flex justify-between items-center">
        <Navigation />
        {user ? (
          <HeaderAvatar />
        ) : (
          <div className="flex justify-between gap-8">
            <div className="flex justify-center ml-9 p-2 rounded-xl" style={{ backgroundColor: "#1eb2a6" }}
            >
              <AuthNavigation to={RouteNames.LOGIN} text={navigation.LOGIN} />
              <p className="text-xl text-white">/</p>
              <AuthNavigation to={RouteNames.REGISTER} text={navigation.REGISTER}/>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
