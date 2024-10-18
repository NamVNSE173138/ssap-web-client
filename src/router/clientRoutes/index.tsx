import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
// import PrivateRoute from "../PrivateRoute";
import Home from "./Home";
import AccountInfo from "./AccountInfo";
import AboutUs from "./AboutUs";
import Events from "./Events";
import BlogDetail from "./BlogDetail";
import BlogList from "./BlogList";
import Application from "./Application";
import ScholarshipProgram from "./ScholarshipProgram";
import Activity from "./Activity";
import ChangePassword from "./ChangePassword";
import Major from "./Major";
import ScholarshipProgramDetail from "./ScholarshipProgramDetail";

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
    path: RouteNames.APPLICATION,
    element: <Application />,
  },
  {
    path: `${RouteNames.ACCOUNT_INFO}/:id`,
    element: <AccountInfo />,
  },
{
    path: RouteNames.CHANGE_PASSWORD,
    element: <ChangePassword />,
    
  },
  {
    path: `${RouteNames.MAJOR}/:id`,
    element: <Major />,
  },
  {
    path: RouteNames.SCHOLARSHIP_PROGRAM,
    element: <ScholarshipProgram/>,
  },
  {
    path: RouteNames.SCHOLARSHIP_PROGRAM_DETAIL,
    element: <ScholarshipProgramDetail/>,
  },
  {
    path: RouteNames.ACTIVITY,
    element: <Activity/>,
  },

  //  {
 //   path: RouteNames.ACCOUNT_INFO,
  //  element: <AccountInfo />,
  //},

];
//const privateRoutes: RouteObject[] = [
  // {
  //   path: `${RouteNames.ACCOUNT_INFO}/:id`,
  //   element: <AccountInfo />,
  // },


// const privateRoutes: RouteObject[] = [
//   {
//     path: RouteNames.ACCOUNT_INFO,
//     element: <AccountInfo />,
//   },
// ];
const clientRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={RouteNames.HOME} replace />,
  },
  // {
  //   element: <PrivateRoute />,
  //   children: [...privateRoutes],
  // },
  ...publicRoutes,
];

export default clientRoutes;
