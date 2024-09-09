import RouteNames from '../../constants/routeNames';
import { RouteObject } from 'react-router-dom';
// import Login from './Login';
// import Register from './Register';
import NotFound from './404';
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
        path: RouteNames.NOT_FOUND,
        element: <NotFound />,
    },
];

export default commonRoutes;
