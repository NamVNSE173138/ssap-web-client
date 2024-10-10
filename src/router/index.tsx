import { createBrowserRouter } from "react-router-dom";
import clientRoutes from "./clientRoutes";
import ClientLayout from "../layout/ApplicantLayout/index";
import commonRoutes from "./commonRoutes/";
import NoLayout from "../layout/NoLayout/index";
import NotFound from "./commonRoutes/404";
import adminRoutes from "./adminRoutes";
import DefaultLayout from "./adminRoutes/Dashboard/layout/DefaultLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [...clientRoutes],
    errorElement: <NotFound />,
  },
  {
    path: "/admin",
    element: <DefaultLayout/>,
    children: [...adminRoutes],
    errorElement: <NotFound />,
  },
  {
    element: <NoLayout />,
    children: [...commonRoutes],
    errorElement: <NotFound />,
  },
]);

export default router;
