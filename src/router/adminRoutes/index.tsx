import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import PrivateRoute from "../PrivateRoute";
import ECommerce from "./Dashboard/pages/Dashboard/ECommerce";
import { Calendar } from "antd";
import AccountsManagement from "./Dashboard/pages/AccountsManagement";
import TransactionsManagement from "./Dashboard/pages/TransactionsManagement";
import MajorManagement from "./Dashboard/pages/MajorManagement";
import CategoryManagement from "./Dashboard/pages/CategoryManagement";
import UniversityManagement from "./Dashboard/pages/UniversityManagement";
import AccountAwaitingApproval from "./Dashboard/pages/AccountAwaitingApproval";

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
  },
  {
    path: "/admin/transactionsmanagement",
    element: <TransactionsManagement />,
  },
  {
    path: RouteNames.MAJOR_MANAGEMENT,
    element: <MajorManagement />,
  },
  {
    path: RouteNames.CATEGORY_MANAGEMENT,
    element: <CategoryManagement />,
  },
  {
    path: RouteNames.UNIVERSITY_MANAGEMENT,
    element: <UniversityManagement/>,
  },
  {
    path: RouteNames.ACCOUNT_AWAITING_APPROVAL,
    element: <AccountAwaitingApproval/>,
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
    element: <PrivateRoute />,
    children: [...privateRoutes],
  },
  ...publicRoutes,
];

export default adminRoutes;
