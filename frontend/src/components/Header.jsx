import React, { useEffect, useState } from "react";
import Logo from "../assets/Logo.jpg";
import { ShoppingCart, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient/apiClient";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const toggleSubmenu = (menu) => {
    if (openSubmenu === menu) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(menu);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setOpenSubmenu(null);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    return `${import.meta.env.VITE_BASE_IMAGE_URL}/${image}`;
  };

  const menuItems = [
    {
      name: "Home",
      link: "/",
      submenu: null,
    },
    {
      name: "About",
      link: "#",
      submenu: [
        { name: "About Us", link: "/about" },
        { name: "FAQs", link: "#" },
      ],
    },
    {
      name: "Courses",
      link: "#",
      submenu: [{ name: "Our Courses", link: "/courses" }],
    },
    {
      name: "Communities",
      link: "/communities",
      submenu: null,
    },
    {
      name: "Contact",
      link: "/contact",
      submenu: null,
    },
  ];

  // Animation variants for left-sliding mobile menu
  const mobileMenuVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const subMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      apiClient
        .get(`/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data.data);
          localStorage.setItem("user", JSON.stringify(res.data.data));
        })
        .catch((err) => {
          console.error("Authentication failed:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };
  return (
    <div className="relative">
      <div className="flex items-center justify-between px-20 py-4 bg-white shadow-md">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src={Logo} alt="Logo" className="h-12 scale-125" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-8">
            {menuItems.map((item, index) => (
              <li key={index} className="group relative">
                {item.submenu ? (
                  <>
                    <button
                      className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                      onClick={() => toggleSubmenu(index)}
                    >
                      {item.name}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.link}
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {subItem.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a
                    href={item.link}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    {item.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Cart and Auth Buttons */}
        <div className="flex items-center space-x-6">
          {/* <div className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600" />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </div> */}

          {user ? (
            <div className="hidden md:flex items-center space-x-3">
              <img
                src={
                  getImageUrl(user.profilePicture) ||
                  "https://via.placeholder.com/40"
                }
                alt="User"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-bold capitalize">{user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 font-medium hover:text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex space-x-3">
              <button
                className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                onClick={() => navigate("/sign-up")}
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with Left-side Animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-10 md:hidden"
              onClick={toggleMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-20 md:hidden"
            >
              <div className="h-full flex flex-col">
                {/* Menu Header with Close Button */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <img src={Logo} alt="Logo" className="h-10" />
                  <button
                    className="text-gray-700 focus:outline-none"
                    onClick={toggleMobileMenu}
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {menuItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-2">
                      {item.submenu ? (
                        <>
                          <button
                            className="w-full flex justify-between items-center text-gray-700 hover:text-blue-600 font-medium py-2"
                            onClick={() => toggleSubmenu(index)}
                          >
                            <span>{item.name}</span>
                            {openSubmenu === index ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                          <AnimatePresence>
                            {openSubmenu === index && (
                              <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={subMenuVariants}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 py-2 space-y-2">
                                  {item.submenu.map((subItem, subIndex) => (
                                    <a
                                      key={subIndex}
                                      href={subItem.link}
                                      className="block py-2 text-gray-600 hover:text-blue-600"
                                      onClick={toggleMobileMenu}
                                    >
                                      {subItem.name}
                                    </a>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <a
                          href={item.link}
                          className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                          onClick={toggleMobileMenu}
                        >
                          {item.name}
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Auth Buttons */}
                {user ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          getImageUrl(user.profilePicture) ||
                          "https://via.placeholder.com/40"
                        }
                        alt="User"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="text-gray-700 font-medium">
                        {user.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => {
                        toggleMobileMenu();
                        navigate("/login");
                      }}
                    >
                      Login
                    </button>
                    <button
                      className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                      onClick={() => {
                        toggleMobileMenu();
                        navigate("/sign-up");
                      }}
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
