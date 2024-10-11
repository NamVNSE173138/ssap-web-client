import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import PrivateRoute from "../PrivateRoute";
import AdminDashboard from "./Dashboard";
import ECommerce from "./Dashboard/pages/Dashboard/ECommerce";
import { Calendar } from "antd";
import AccountsManagement from "./Dashboard/pages/AccountsManagement";


const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.DASHBOARD,
    element: <ECommerce />,
  },
  {
    path: "/admin/calendar",
    element: <Calendar />,
  },
  {
    path: "/admin/accountsmanagement",
    element: <AccountsManagement />,
  }
];
const privateRoutes: RouteObject[] = [
//   {
//     path: RouteNames.ACCOUNT_INFO,
//     element: <Dashboard />,
//   },
];
const adminRoutes: RouteObject[] = [
  {
    element: <PrivateRoute />,
    children: [...privateRoutes],
  },
  ...publicRoutes,
];

export default adminRoutes;
