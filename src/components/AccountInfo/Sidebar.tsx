import RouteNames from "@/constants/routeNames";
import { removeToken, removeUser } from "@/reducers/tokenSlice";
import { getApplicantProfileById } from "@/services/ApiServices/applicantProfileService";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import {
  AiOutlineAudit,
  AiOutlineBarChart,
  AiOutlineBook,
  AiOutlineHistory,
  AiOutlineContacts
} from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "../../hooks/useMediaQuery";

type SidebarProps = {
  className?: string;
  needRefresh?: boolean;
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
    <li
      onClick={handleClick}
      className={`lg:px-12 px-5 gap-4 transition-colors w-full py-2 cursor-pointer duration-200 hover:bg-[#179d8f] group rounded-lg ${
        isActive && "bg-[#1eb2a6] text-black"
      }`}
    >
      <div className="flex justify-start items-center gap-8">
        <Icon
          size={24}
          className="text-[#000] group-hover:text-white duration-200 transition-colors"
        />
        <Link
          to={link}
          className="lg:text-[#000] text-[#000] lg:text-lg text-xl group-hover:text-white"
        >
          {text}
        </Link>
      </div>
    </li>
  );
};

const Sidebar = ({ className, needRefresh }: SidebarProps) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const [hasProfile, setHasProfile] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.token.user);
  const id = user?.id;
  const role = user?.role;

  const fetchSkills = async () => {
    try {
      await getApplicantProfileById(Number(id || user?.id));
      setHasProfile(true);
    } catch (error: any) {
      if (error.response.data.detail.includes("applicantId")) {
        setHasProfile(false);
      }
    } finally {
    }
  };

  const listItems: ListItemProps[] = [
    { Icon: AiOutlineAudit, text: "Account", link: RouteNames.ACCOUNT_INFO },
    { Icon: AiOutlineBook, text: "Information", link: RouteNames.INFORMATION },
    // {
    //   Icon: AiOutlineBook,
    //   text: `Skills ${hasProfile ? "" : "(You need to add profile first)"} `,
    //   link: hasProfile ? RouteNames.SKILLS : "",
    // },
    {
      Icon: AiOutlineBarChart,
      text: "Change Password",
      link: RouteNames.CHANGE_PASSWORD,
    },
    { Icon: AiOutlineBook, text: "Activity", link: RouteNames.ACTIVITY },
    { Icon: AiOutlineHistory, text: "History", link: RouteNames.HISTORY },
  ];
  if (role === "Funder") {
    listItems.push({
      Icon: AiOutlineContacts,
      text: "Expert",
      link: RouteNames.TRACKING_EXPERT,
    });
  }
  if (role === "Expert") {
    listItems.push({
      Icon: AiOutlineContacts,
      text: "Review",
      link: RouteNames.APPLICATION_REVIEW,
    });
  }
  if (role === "Applicant") {
    listItems.push({
      Icon: AiOutlineBook,
      text: `Skills ${hasProfile ? "" : "(You need to add profile first)"} `,
      link: hasProfile ? RouteNames.SKILLS : "",
    });
  }

  
  const handleLogout = () => {
    setTimeout(() => {
      dispatch(removeToken());
      dispatch(removeUser());
      localStorage.removeItem("token");
      navigate(RouteNames.HOME);
    }, 500);
  };

  useEffect(() => {
    fetchSkills();
  }, [needRefresh]);

  return (
    <>
      <div className={`${className} flex flex-col my-10 shadow-2 bg-white rounded-lg`}>
        <div className="flex flex-col items-center gap-8">
        </div>
        {isAboveMediumScreens ? (
          <menu className="w-full flex flex-col ">
            {listItems.map((item, index) => (
              <ListItem
                key={index}
                Icon={item.Icon}
                text={item.text}
                link={item.link}
              />
            ))}
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
            }}
          >
            <button
              className="rounded-full h-full bg-blue-500 p-2"
              onClick={() => setIsMenuToggled(!isMenuToggled)}
            >
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
          </motion.div>
        )}

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
              <div className="flex justify-center items-center gap-4 mb-5">
                <img
                  src="https://via.placeholder.com/150"
                  alt="profile"
                  className="rounded-full w-24"
                />
              </div>
              <ul className="flex justify-around flex-col gap-10">
                {listItems.map((item) => (
                  <ListItem
                    key={item.link}
                    Icon={item.Icon}
                    text={item.text}
                    link={item.link}
                  />
                ))}
                <li
                  onClick={handleLogout}
                  className="lg:px-12 px-5 gap-4 transition-colors w-full py-2 cursor-pointer duration-200 hover:bg-blue-400 group"
                >
                  <div className="flex justify-start gap-8">
                    <BiLogOutCircle
                      size={24}
                      className="text-[#067CEB] group-hover:text-white duration-200 transition-colors"
                    />
                    <p className="lg:text-[#067CEB] text-[#2968a4] lg:text-lg text-xl group-hover:text-white">
                      Log out
                    </p>
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
