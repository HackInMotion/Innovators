import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Us */}
        <div className="space-y-4">
          <h3 className="text-white text-xl font-bold mb-4">About Us</h3>
          <p className="text-gray-400">
            We are providing high-quality online courses for about ten years. Our
            all instructors expert and highly experienced. We provide all kinds of
            course materials to our students.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-white text-xl font-bold mb-4">Categories</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Business
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Education
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Graphics Design
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Programming
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Web Design
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                WordPress
              </a>
            </li>
          </ul>
        </div>

        {/* Recent Posts */}
        <div className="space-y-4">
          <h3 className="text-white text-xl font-bold mb-4">Recent Posts</h3>
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <p>Learn Web Development from Experts</p>
                <p className="text-sm text-gray-500">March 1, 2025</p>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <p>Expand Your Career Opportunities With Python</p>
                <p className="text-sm text-gray-500">March 1, 2025</p>
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="space-y-4">
          <h3 className="text-white text-xl font-bold mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-400">
                Guru Nanak Dev Engineerimg College, Ludhiana, Punjab, India
                <br /> 
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <a
                href="mailto:hackathongndec@gmail.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                hackathongndec@gmail.com
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <a
                href="tel:+981234567890"
                className="text-gray-400 hover:text-white transition-colors"
              >
                +91 70090 79926
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} Online Courses. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;