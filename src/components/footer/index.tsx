import { Link } from "react-router-dom"
import Logo from "../logo"
import FacebookLogo from '../../assets/facebook.png';
import ZaloLogo from '../../assets/zalo.png';

const Footer = () => {
  return (
    <footer
  className="flex flex-col justify-between px-8 pt-8"
  style={{ backgroundColor: "#fff" }}
>
  <div className="relative">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Logo and Description */}
      <div className="col-span-1 md:col-span-2 text-lg">
        <Logo />
        <div className="opacity-70 mt-4 md:mt-6">
          <p className="w-full md:w-[80%] text-lg text-[#1eb2a6]">
            Get full control of debts in the digital world. Simple labore et
            dolore ma.
          </p>
        </div>
      </div>

      {/* Organization Links */}
      <div className="mt-8 md:mt-0">
        <p className="mb-4 font-semibold text-[24px] text-black">ORGANIZATION</p>
        <menu className="flex flex-col gap-2 text-[16px] text-black">
          <li className="hover:underline">
            <Link to="/about-us">ABOUT US</Link>
          </li>
          <li className="hover:underline">
            <Link to="/scholarship-program">SCHOLARSHIP PROGRAMS</Link>
          </li>
          <li className="hover:underline">
            <Link to="/services">SERVICES</Link>
          </li>
        </menu>
      </div>

      {/* Get In Touch */}
      {/* <div className="mt-8 md:mt-0">
        <p className="mb-4 font-semibold text-[24px] text-black">GET IN TOUCH</p>
        <menu className="flex flex-col gap-2 text-[16px] text-black">
          <li className="hover:underline">
            <Link to="/ac-cleaning-services">FOOTER</Link>
          </li>
          <li className="hover:underline">
            <Link to="/ac-cleaning-services">FOOTER</Link>
          </li>
          <li className="hover:underline">
            <Link to="/ac-cleaning-services">FOOTER</Link>
          </li>
          <li className="hover:underline">
            <Link to="/ac-cleaning-services">FOOTER</Link>
          </li>
          <li className="hover:underline">
            <Link to="/ac-cleaning-services">FOOTER</Link>
          </li>
        </menu>
      </div> */}
    </div>

    {/* Social Media Links */}
    <div className="flex flex-wrap items-center gap-4 py-6 mt-8 border-t border-gray-400">
      <p className="text-lg font-medium opacity-70 text-[#1eb2a6]">FOLLOW US</p>
      <Link to="" target="_blank">
        <img
          src={FacebookLogo}
          alt="facebook"
          className="w-[35px] h-[35px] rounded-full"
        />
      </Link>
      <Link to="" target="_blank">
        <img
          src={ZaloLogo}
          alt="zalo"
          className="w-[35px] h-[35px] rounded-full"
        />
      </Link>
    </div>
  </div>
  {/* <Background /> */}
</footer>

  )
}

export default Footer
