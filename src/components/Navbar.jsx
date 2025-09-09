import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import logo from "../assets/images/logo.png";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const NavbarItem = ({ title, classProps, to }) => {
    return (
      <li className={`mx-4 cursor-pointer ${classProps}`}>
        <Link to={to}>{title}</Link>
      </li>
    );
  };

  NavbarItem.propTypes = {
    title: PropTypes.string.isRequired,
    classProps: PropTypes.string,
    to: PropTypes.string.isRequired,
  };


  const navItems = [
    { title: "Market", to: "/market" },
    { title: "Exchange", to: "/exchange" },
    { title: "Tutorials", to: "/tutorials" },
    { title: "Wallets", to: "/wallets" },
  ];

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      {/* Logo */}
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <Link to="/">
          <img src={logo} alt="logo" className="w-44 cursor-pointer" />
        </Link>
      </div>

      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {navItems.map((item, index) => (
          <NavbarItem
            key={item.title + index}
            title={item.title}
            to={item.to}
          />
        ))}
        <li className="bg-blue-700 py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-blue-500">
          <Link to="/login">Login</Link>
        </li>
      </ul>

      {/* Mobile Menu */}
      <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <AiOutlineMenu
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}

        {toggleMenu && (
          <ul
            className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none 
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {navItems.map((item, index) => (
              <NavbarItem
                key={item.title + index}
                title={item.title}
                to={item.to}
                classProps="my-2 text-lg"
              />
            ))}
            <li className="bg-blue-700 py-2 px-7 mx-4 mt-4 rounded-full cursor-pointer hover:bg-blue-500">
              <Link to="/login">Login</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
