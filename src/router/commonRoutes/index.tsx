import RouteNames from '../../constants/routeNames';
import { RouteObject } from 'react-router-dom';
// import Login from './Login';
// import Register from './Register';
import NotFound from './404';
import Login from './Login/Login';
import Register from './Register/Register';
import ForgetPassword from './ForgotPassword/ForgetPassword';
// import UnauthenticatedRoute from '../UnauthenticatedRoute';
// import GoogleOAuthCallback from './GoogleOAuthCallback';

const commonRoutes: RouteObject[] = [
    // {
    //     element: <UnauthenticatedRoute />,
    //     children: [
    //         {
    //             path: RouteNames.REGISTER,
    //             element: <Register />,
    //         },
    //         {
    //             path: RouteNames.LOGIN,
    //             element: <Login />,
    //         },
    //         {
    //             path: RouteNames.GG_OAUTH,
    //             element: <GoogleOAuthCallback />,
    //         },
    //     ],
    // },
    {
        path: RouteNames.LOGIN,
        element: <Login />,
    },
    {
        path: RouteNames.REGISTER,
        element: <Register />,
    },
    {
        path: RouteNames.FORGOT_PASSWORD,
        element: <ForgetPassword />,
    },
    {
        path: RouteNames.NOT_FOUND,
        element: <NotFound />,
    },
];

export default commonRoutes;
