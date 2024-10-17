import { setToken, setUser } from "@/reducers/tokenSlice";
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
  const jwt = queryParams.get('jwt');

  useEffect(() => {
    if (result === 'success' && jwt) {
      if(parseJwt(jwt) === null) {
        navigate("/login");
      };
      dispatch(setToken(jwt));
      const userInfo = parseJwt(jwt);
      dispatch(setUser(userInfo)); 
      navigate("/");
    }
    else {
      navigate("/login");
    }
  }, [result, jwt]);   
  
  
  return (
    <div>Redirecting...</div>
  )
}

export default GoogleLogin;
