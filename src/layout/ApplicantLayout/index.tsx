import { Outlet } from 'react-router-dom';
import Header from '../../components/header/index';
import Footer from '../../components/footer/index';

const ClientLayout = () => {
    return (
        <>
            <div className="flex flex-col justify-between h-screen">
                <Header />
                <Outlet />
                <Footer />
            </div>
        </>
    );
};

export default ClientLayout;
