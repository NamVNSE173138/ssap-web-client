import { createBrowserRouter } from "react-router-dom";
import clientRoutes from "./clientRoutes";
import ClientLayout from "../layout/ApplicantLayout/index";
import commonRoutes from "./commonRoutes/";
import NoLayout from "../layout/NoLayout/index";
import NotFound from "./commonRoutes/404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [...clientRoutes],
    errorElement: <NotFound />,
  },
  {
    element: <NoLayout />,
    children: [...commonRoutes],
    errorElement: <NotFound />,
  },
]);

export default router;
