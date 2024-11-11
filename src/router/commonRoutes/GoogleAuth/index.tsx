import RoleNames from "@/constants/roleNames";
import { setToken, setUser } from "@/reducers/tokenSlice";
import { NotifyNewUser } from "@/services/ApiServices/notification";
import parseJwt from "@/services/parseJwt";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate = useNavigate();
  //const token = useSelector((state: RootState) => state.token.token);
  const dispatch = useDispatch();
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const result = queryParams.get('result');
  const isNewUser = queryParams.get('isNewUser');
  const jwt = queryParams.get('jwt');

  const sendNotification = async () => {
    if (result === 'success' && jwt) {
      if(parseJwt(jwt) === null) {
        navigate("/login");
        return;
      };
      dispatch(setToken(jwt));
      const userInfo = parseJwt(jwt);
      dispatch(setUser(userInfo));
      
      if(userInfo.role === RoleNames.ADMIN) {
        navigate("/admin");
      }
      else if(userInfo.role === RoleNames.FUNDER) {
        navigate("/funder");
      }
      else if(userInfo.role === RoleNames.PROVIDER) {
        navigate("/provider");
      }
      else if(userInfo.role === RoleNames.EXPERT) {
        navigate("/expert");
      }
      else {
        if(isNewUser == "True")
          navigate("/", { state: { sendNotification: true } });
        else navigate("/");
      }
    }
    else {
      navigate("/login");
    }
    
  }

  useEffect(() => {
    sendNotification()
  }, []);   
  
  
  return (
    <div>Redirecting...</div>
  )
}

export default GoogleLogin;
