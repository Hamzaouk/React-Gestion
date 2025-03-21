import React from "react";
import logo from "../assets/Workers.jpg";

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">ConstructionXpert</h1>
      <img src={logo} alt="ConstructionXpert Logo" className="mb-4" />
      <p className="text-lg max-w-2xl mx-auto px-4">
        ConstructionXpert is a leading provider of comprehensive construction
        management solutions. We specialize in project planning, resource
        allocation, and task management, ensuring that every project is
        completed on time and within budget. With a dedicated team of experts
        and advanced tools, we deliver results that exceed expectations, all
        while maintaining the highest standards of quality and safety. Whether
        you're managing a small renovation or a large-scale development, we
        provide the expertise and support to make your vision a reality.
      </p>
    </div>
  );
};

export default AboutUs;
