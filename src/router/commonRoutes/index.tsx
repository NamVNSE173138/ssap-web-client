import RouteNames from '../../constants/routeNames';
import { RouteObject } from 'react-router-dom';
import NotFound from './404';
import Login from './Login/Login';
import Register from './Register/Register';
import ForgetPassword from './ForgotPassword/ForgetPassword';
import GoogleLogin from './GoogleAuth';
import UnauthenticatedRoute from '../UnauthenticatedRoute';


const commonRoutes: RouteObject[] = [
    {
        element: <UnauthenticatedRoute />,
        children: [
            {
                path: RouteNames.LOGIN,
                element: <Login />,
            },
            {
                path: RouteNames.REGISTER,
                element: <Register />,
            },
            {
                path: RouteNames.GOOGLE,
                element: <GoogleLogin/>,
            },
            {
                path: RouteNames.FORGOT_PASSWORD,
                element: <ForgetPassword />,
            },
            {
                path: RouteNames.NOT_FOUND,
                element: <NotFound />,
            },
        ],
    },
];

export default commonRoutes;
