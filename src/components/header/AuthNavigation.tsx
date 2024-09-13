import { Link } from 'react-router-dom';

interface AuthNavigationProps {
    to: string;
    text: string;
}

const AuthNavigation = ({to, text}: AuthNavigationProps) => {
    return (
        <div className='flex flex-col'>
            <Link to={to} className='peer/login text-xl text-white font-normal'>{text}</Link>
            <div className='w-full h-[2px] bg-white scale-x-0 peer-hover/login:scale-x-100 transition' />
        </div>
    );
};

export default AuthNavigation;
