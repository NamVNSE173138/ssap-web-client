import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Home from "./Home";
import AccountInfo from "./AccountInfo";
import AboutUs from "./AboutUs";
import Events from "./Events";
import BlogDetail from "./BlogDetail";
import BlogList from "./BlogList";
import ScholarshipProgram from "./ScholarshipProgram";
import Activity from "./Activity";
import ChangePassword from "./ChangePassword";
import Major from "./Major";
import Chat from "./Chat";
import ScholarshipProgramDetail from "./ScholarshipProgramDetail";
import ApplyScholarship from "./ApplyScholarship";
import Information from "./Information";
import PrivateRoute from "../PrivateRoute";
import SkillInformation from "./Skills";

const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.HOME,
    element: <Home />,
  },
  {
    path: RouteNames.ABOUT_US,
    element: <AboutUs />,
  },
  {
    path: RouteNames.EVENTS,
    element: <Events />,
  },
  {
    path: RouteNames.BLOGS_LIST,
    element: <BlogList />,
  },
  {
    path: RouteNames.BLOGS_DETAIL,
    element: <BlogDetail />,
  },
  
  {
    path: RouteNames.MAJOR,
    element: <Major />,
  },
  {
    path: RouteNames.SCHOLARSHIP_PROGRAM,
    element: <ScholarshipProgram />,
  },
  {
    path: RouteNames.SCHOLARSHIP_PROGRAM_DETAIL,
    element: <ScholarshipProgramDetail />,
  },
];

const privateRoutes: RouteObject[] = [
  {
    path: RouteNames.ACCOUNT_INFO,
    element: <AccountInfo />,
  },
  {
    path: RouteNames.INFORMATION,
    element: <Information />,
  },
  {
    path: RouteNames.ACTIVITY,
    element: <Activity />,
  },
  {
    path: RouteNames.APPLICATION,
    element: <ApplyScholarship />,
  },
  {
    path: RouteNames.ACCOUNT_INFO,
    element: <AccountInfo />,
  },
  {
    path: RouteNames.CHANGE_PASSWORD,
    element: <ChangePassword />,

  },
  {
    path: RouteNames.CHAT,
    element: <Chat />,
  },
  {
    path: RouteNames.SKILLS,
    element: <SkillInformation />,
  }
];

const clientRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={RouteNames.HOME} replace />,
  },
  {
    element: <PrivateRoute />,
    children: [...privateRoutes],
  },
  ...publicRoutes,
];

export default clientRoutes;













// import { Navigate, RouteObject } from "react-router-dom";
// import RouteNames from "../../constants/routeNames";
// import Home from "./Home";
// import AccountInfo from "./AccountInfo";
// import AboutUs from "./AboutUs";
// import Events from "./Events";
// import BlogDetail from "./BlogDetail";
// import BlogList from "./BlogList";
// import Application from "./Application";
// import ScholarshipProgram from "./ScholarshipProgram";
// import Activity from "./Activity";
// import ChangePassword from "./ChangePassword";
// import Major from "./Major";
// import Chat from "./Chat";
// import ScholarshipProgramDetail from "./ScholarshipProgramDetail";
// import ApplyScholarship from "./ApplyScholarship";
// import Information from "./Information";

// const publicRoutes: RouteObject[] = [
//   {
//     path: RouteNames.HOME,
//     element: <Home />,
//   },
//   {
//     path: RouteNames.ABOUT_US,
//     element: <AboutUs />,
//   },
//   {
//     path: RouteNames.EVENTS,
//     element: <Events />,
//   },
//   {
//     path: RouteNames.BLOGS_LIST,
//     element: <BlogList />,
//   },
//   {
//     path: RouteNames.BLOGS_DETAIL,
//     element: <BlogDetail />,
//   },
//   {
//     path: RouteNames.APPLICATION,
//     element: <ApplyScholarship />,
//   },
//   {
//     path: `${RouteNames.ACCOUNT_INFO}`,
//     element: <AccountInfo />,
//   },
//   {
//     path: RouteNames.CHANGE_PASSWORD,
//     element: <ChangePassword />,

//   },
//   {
//     path: RouteNames.MAJOR,
//     element: <Major />,
//   },
//   {
//     path: RouteNames.SCHOLARSHIP_PROGRAM,
//     element: <ScholarshipProgram />,
//   },
//   {
//     path: RouteNames.SCHOLARSHIP_PROGRAM_DETAIL,
//     element: <ScholarshipProgramDetail />,
//   },
//   {
//     path: RouteNames.ACTIVITY,
//     element: <Activity />,
//   },
//   {
//     path: RouteNames.CHAT,
//     element: <Chat />,
//   },
//   {
//     path: RouteNames.INFORMATION,
//     element: <Information />,
//   }
// ];

// const clientRoutes: RouteObject[] = [
//   {
//     path: "/",
//     element: <Navigate to={RouteNames.HOME} replace />,
//   },
//   ...publicRoutes,
// ];

// export default clientRoutes;

