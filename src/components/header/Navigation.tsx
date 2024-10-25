import { Link } from "react-router-dom";
import navigation from "../../constants/multilingual/navigation";
import RouteNames from "../../constants/routeNames";
import DropdownNotification from "@/router/adminRoutes/Dashboard/components/Header/DropdownNotification";

type NavItem = {
  text: string;
  to: string;
};

const navItems: NavItem[] = [
  {
    text: navigation.ABOUT_US,
    to: RouteNames.ABOUT_US,
  },
  {
    text: navigation.EVENTS,
    to: RouteNames.EVENTS,
  },
  {
    text: navigation.BLOGS,
    to: RouteNames.BLOGS_LIST,
  },
  {
    text: navigation.SCHOLARSHIP_PROGRAM,
    to: RouteNames.SCHOLARSHIP_PROGRAM,
  },
  {
    text: navigation.CHAT,
    to: RouteNames.CHAT,
  }
];

const Navigation = () => {
  return (
    <nav>
      <div className="flex justify-between mr-10">
        <ul className=" text-xl font-normal flex justify-around gap-10" style={{color: "#5559C7"}}>
          {navItems.map((item) => (
            <li key={item.text} className="group/nav">
              <Link to={item.to}>{item.text}</Link>
              <div className="h-[2px] bg-blue-700 scale-x-0 group-hover/nav:scale-x-100 transition" />
            </li>
          ))}
          <DropdownNotification/>
        </ul>
      </div>
      
    </nav>
  );
};

export default Navigation;
