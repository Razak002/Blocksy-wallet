import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../../src/assets/images/logo.png";

const Footer = () => {
  const NavbarItem = ({ title, classProps, to }) => {
    return (
      <li className={`mx-4 cursor-pointer ${classProps || ""}`}>
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
  ];

  return (
    <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
      <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
        <div className="flex flex-[0.5] justify-center items-center">
          <img src={logo} alt="logo" className="w-32" />
        </div>
        <ul className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-4">
          {navItems.map((item, index) => (
            <NavbarItem
              key={item.title + index}
              title={item.title}
              to={item.to}
            />
          ))}
        </ul>
      </div>

      <div className="flex justify-center items-center flex-col mt-5">
        <p className="text-white text-sm text-center">Come join us</p>
        <p className="text-white text-sm text-center">info@solodev.com</p>
      </div>

      <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5" />

      <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
        <p className="text-white text-sm text-center">@devrazak 2025</p>
        <p className="text-white text-sm text-center">
          All rights reserved 2025
        </p>
      </div>
    </div>
  );
};

export default Footer;
