import Logo from "../logo"
import Navigation from "./Navigation"

const Header = () => {
  return (
    <header className="flex justify-between items-center p-1 " style={{backgroundColor: "#BBD4EA"}}>
        <Logo />
        <div className="flex justify-between items-center" >
          <Navigation/>
        </div>
        
    </header>
  )
}

export default Header