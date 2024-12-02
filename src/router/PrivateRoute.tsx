import { RootState } from "@/store/store";
import { notification } from "antd";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const isUser = useSelector((state: RootState) => state.token.user);
  console.log("user", isUser);

  if(isUser && (isUser.role == "Provider" || isUser.role == "Funder") && isUser.status == "NeedUploadMore") {
    notification.info({
      message: "Your document need upload more.",
      description: "Please upload more documents and wait for the admin to approve your document.",
    })
    return <Navigate to={`/${isUser.role}/profile`} replace />
  }
  else if(isUser && (isUser.role == "Provider" || isUser.role == "Funder") && isUser.status == "Pending") {
    notification.info({
      message: "Your document is pending.",
      description: "Please wait for the admin to approve your document.",
    })
    return <Navigate to={`/${isUser.role}/profile`} replace />
  }

  return isUser ? <Outlet /> : <Navigate to="/login" replace />;
  // if(!isUser) return <Navigate to="/login" replace />
  // if(!role.includes(user?.role)) return <NotFound />
  // return <Outlet />
};

export default PrivateRoute;
