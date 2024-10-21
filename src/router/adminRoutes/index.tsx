import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import PrivateRoute from "../PrivateRoute";
import AdminDashboard from "./Dashboard";
import ECommerce from "./Dashboard/pages/Dashboard/ECommerce";
import { Calendar } from "antd";
import AccountsManagement from "./Dashboard/pages/AccountsManagement";
import RoleNames from "@/constants/roleNames";


const privateRoutes: RouteObject[] = [
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
const publicRoutes: RouteObject[] = [
//   {
//     path: RouteNames.ACCOUNT_INFO,
//     element: <Dashboard />,
//   },
];
const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <Navigate to={RouteNames.DASHBOARD} replace />,
  },
  {
    element: <PrivateRoute role={[RoleNames.ADMIN]}/>,
    children: [...privateRoutes],
  },
  ...publicRoutes,
];

export default adminRoutes;
