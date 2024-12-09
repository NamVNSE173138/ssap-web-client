import { Link } from "react-router-dom"
import Background from "./components/Background"
import Logo from "../logo"
import FacebookLogo from '../../assets/facebook.png';
import ZaloLogo from '../../assets/zalo.png';

const Footer = () => {
  return (
    <footer className="flex flex-col justify-between px-8 pt-8" style={{backgroundColor:"#fff"}}>
      <div className="relative">
        <div className="absolute grid grid-rows-1 grid-cols-4 ">
        <div className="col-span-2 text-lg">
                    <Logo/>
                    <div className='opacity-70'>
                        <p className="w-[45%] p-10 text-lg text-[#1eb2a6]">Get a full control of debts in the dsu digital world simple labore et dolore ma</p>
                        <p></p>
                        <p></p>
                    </div>
                </div>
                <div className="mt-16 basis-1/2 md:mt-0 text-black">
                    <p className="mt-9 mb-4 font-semibold text-[30px]">ORGANIZATION</p>
                    <menu className="flex flex-col gap-1.5 text-[16px] text-black">
                        <li className='hover:underline'>
                            <Link to="/about-us">INTRODUCE</Link>
                        </li>
                        <li className='hover:underline'>
                            <Link to="/become-partner">RECRUITMENT</Link>
                        </li>
                        <li className='hover:underline'>
                            <Link to="/blogs-list">BLOGS</Link>
                        </li>
                        <li className='hover:underline'>
                            <Link to="#">DISCOUNT</Link>
                        </li>
                        <li className='hover:underline'>
                            <Link to="#">TERMS</Link>
                        </li>
                        <li className='hover:underline'>
                            <Link to="#">PRIVACY</Link>
                        </li>
                    </menu>
                </div>
                <div className="mt-16 basis-1/4 md:mt-0">
                    <p className="mt-9 mb-4 font-semibold text-[30px] text-black">GET IN TOUCH</p>
                    <menu className="flex flex-col gap-1.5 text-[16px] text-black">
                        <li className='hover:underline'>
                            <Link to="/ac-cleaning-services">FOOTER</Link>
                        </li>
                        <li className='hover:underline'>
                            <Link to="/ac-cleaning-services">FOOTER</Link>
                        </li>
                        <li className='hover:underline'>
                            <Link to="/ac-cleaning-services">FOOTER</Link>
                        </li>
                        <li className='hover:underline'>
                            <Link to="/ac-cleaning-services">FOOTER</Link>
                        </li>
                        <li className='hover:underline'>
                            <Link to="/ac-cleaning-services">FOOTER</Link>
                        </li>
                    </menu>
                </div>
        </div>
        
        <Background/>
        <div className="flex items-center gap-2 py-6 border-t border-gray-400 basis-1/4  ">
                <p className="text-xl font-medium opacity-70 text-[#1eb2a6]">FOLLOW US</p>
                <Link to='' target='_blank'>
                    <img src={FacebookLogo} alt="facebook" className="w-[35px] aspect-square rounded-full" />
                </Link>
                <Link to='' target='_blank'>
                    <img src={ZaloLogo} alt="zalo" className="w-[35px] aspect-square rounded-full" />
                </Link>
            </div>
      </div>
    </footer>
  )
}

export default Footer