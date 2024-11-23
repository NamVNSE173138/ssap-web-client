import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const isUser = useSelector((state: RootState) => state.token.user);
  console.log("user", isUser);

  return isUser ? <Outlet /> : <Navigate to="/login" replace />;
  // if(!isUser) return <Navigate to="/login" replace />
  // if(!role.includes(user?.role)) return <NotFound />
  // return <Outlet />
};

export default PrivateRoute;
