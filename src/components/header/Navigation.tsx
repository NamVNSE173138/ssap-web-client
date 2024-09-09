import { Link } from "react-router-dom";
import navigation from "../../constants/multilingual/navigation";
import RouteNames from "../../constants/routeNames";

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
    text: navigation.APPLICATION,
    to: RouteNames.APPLICATION,
  },
];

const Navigation = () => {
  return (
    <nav>
      <div className="flex justify-between">
        <ul className=" text-xl flex justify-around gap-10">
          {navItems.map((item) => (
            <li key={item.text} className="group/nav">
              <Link to={item.to}>{item.text}</Link>
              <div className="h-[2px] bg-blue-700 scale-x-0 group-hover/nav:scale-x-100 transition" />
            </li>
          ))}
        </ul>
        <div className="text-xl" style={{backgroundColor: "#5559C7"}}>
          SignIn/SignUp
        </div>
      </div>
      
    </nav>
  );
};

export default Navigation;
