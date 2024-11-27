import AppLogo from '../../assets/logo.jpg';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link to="/home">
            <img src={AppLogo} alt="app_logo" className="w-[15%] rounded-full ml-10 " />
        </Link>
    );
};

export default Logo;