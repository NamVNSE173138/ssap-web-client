import { Link } from "react-router-dom";
import navigation from "../../constants/multilingual/navigation";
import RouteNames from "../../constants/routeNames";
import DropdownNotification from "@/router/adminRoutes/Dashboard/components/Header/DropdownNotification";

type NavItem = {
  text: string;
  to: string;
};
//User Guide
const navItems: NavItem[] = [
  {
    text: navigation.ABOUT_US,
    to: RouteNames.ABOUT_US,
  },
  {
    text: navigation.SCHOLARSHIP_PROGRAM,
    to: RouteNames.SCHOLARSHIP_PROGRAM,
  },
  {
    text: navigation.SERVICES,
    to: RouteNames.SERVICES,
  },
  {
    text: navigation.CHAT,
    to: RouteNames.CHAT,
  }, {
    text: navigation.USER_GUIDE,
    to: RouteNames.USER_GUIDE,
  }
];

const Navigation = () => {
  return (
    <nav>
      <div className="flex justify-between mr-10">
        <ul className=" text-xl font-normal flex justify-around gap-10" style={{ color: "#fff" }}>
          {navItems.map((item) => (
            <li key={item.text} className="group/nav">
              <Link className="text-xl" to={item.to}>{item.text}</Link>
              <div className="h-[2px] bg-[#1eb2a6] scale-x-0 group-hover/nav:scale-x-100 transition" />
            </li>
          ))}
          <DropdownNotification />
        </ul>
      </div>

    </nav>
  );
};

export default Navigation;
