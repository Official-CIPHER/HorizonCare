import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* ------------ Left Section */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6 text-lg">
            At HorizonCare, we redefine healthcare management with innovative
            solutions designed for seamless operations and patient satisfaction.
            Our system ensures efficiency and accuracy, empowering medical teams
            to focus on delivering exceptional care.
          </p>
        </div>

        {/* ------------ Middle Section */}
        <div>
          <p className="text-lg font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap2 text-gray-600 text-lg">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* ------------ RIght Section */}
        <div>
          <p className="text-lg font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap2 text-gray-600 text-lg">
            <li>+91-123-456-7890</li>
            <li>vishalkumar211103@gmail.com</li>
          </ul>
        </div>
      </div>

      {/*---------- Copy right text ----------------  */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2024@ HorizonCare - All Right Reversed.
        </p>
      </div>
    </div>
  );
};

export default Footer;
