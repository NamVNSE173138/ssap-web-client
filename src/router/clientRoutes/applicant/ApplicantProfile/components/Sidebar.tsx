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
  AiOutlineHistory,
} from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "../../../../../hooks/useMediaQuery";
import { FaLock } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdOutlineAccountCircle } from "react-icons/md";

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
      className={`lg:px-12 px-5 gap-4 transition-colors w-full py-2 cursor-pointer duration-200 hover:bg-[#179d8f] group rounded-lg ${isActive && "bg-[#1eb2a6] text-black"}`}
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

  const fetchSkills = async () => {
    try {
      const data = await getApplicantProfileById(Number(id || user?.id));
      setHasProfile(true);
    } catch (error: any) {
      if (error.response.data.detail.includes("applicantId")) {
        setHasProfile(false);
      }
    }
  };

  // Only keeping relevant sections
  const listItems = [
    {
      section: "User",
      items: [
        {
          Icon: MdOutlineAccountCircle,
          text: "My Account",
          link: RouteNames.ACCOUNT_INFO,
        },
        {
          Icon: ImProfile,
          text: "Applicant Profile",
          link: RouteNames.ACCOUNT_INFO,
        },

        {
          Icon: FaLock,
          text: "Password & Authentication",
          link: RouteNames.CHANGE_PASSWORD,
        },
      ],
    },
    {
      section: "History",
      items: [
        {
          Icon: AiOutlineHistory,
          text: "Service Request",
          link: RouteNames.ACTIVITY,
        },
        {
          Icon: AiOutlineHistory,
          text: "Scholarship Application",
          link: RouteNames.HISTORY,
        },
      ],
    },

    {
      section: "Other",
      items: [
        {
          Icon: BiLogOutCircle,
          text: "Log Out",
          link: "/",
        },
      ],
    },
  ];

  useEffect(() => {
    fetchSkills();
  }, [needRefresh]);

  return (
    <>
      <div className={`${className} flex flex-col py-10 border-r-2`}>
        <div className="flex flex-col items-center gap-8">
          <div className="h-[1px] bg-gray-100 w-2/3"></div>
        </div>
        {isAboveMediumScreens ? (
          <menu className="w-full flex flex-col">
            {listItems.map((section, index) => (
              <div key={index}>
                <h2 className="px-5 py-2 font-semibold text-lg text-gray-700">
                  {section.section}
                </h2>
                {section.items.map((item, idx) => (
                  <ListItem
                    key={idx}
                    Icon={item.Icon}
                    text={item.text}
                    link={item.link}
                  />
                ))}
              </div>
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
            <div className="flex justify-end p-12">
              <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="">
              <div className="flex justify-center items-center gap-4 mb-5">
                <img
                  src="https://via.placeholder.com/150"
                  alt="profile"
                  className="rounded-full w-24"
                />
              </div>
              <ul className="flex justify-around flex-col gap-10">
                {listItems.map((section) => (
                  <div key={section.section}>
                    <h2 className="px-5 py-2 font-semibold text-lg text-gray-700">
                      {section.section}
                    </h2>
                    {section.items.map((item) => (
                      <ListItem
                        key={item.link}
                        Icon={item.Icon}
                        text={item.text}
                        link={item.link}
                      />
                    ))}
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
