import React from "react";
import A from '../assets/a.svg';
import B from '../assets/b.svg';
import C from '../assets/c.svg';
import D from '../assets/d.svg';
import Landing from '../assets/landing.jpg';
import mobile from '../assets/mobile.jpg';

const HeroImage = () => {
  return (
    <div className="bg-[#f4f8fc] text-[#0d1b2a] font-sans">
      <div className="w-full h-[80vh] overflow-hidden">
        <img
          className="w-full h-full object-cover scale-75 transition-transform duration-300 hover:scale-100"
          src={Landing}
          alt="landingimg"
        />
      </div>

      <div className="text-center mt-12 mb-8">
        <h2 className="text-[#0d1b2a] text-3xl font-semibold">
          All the skills you need in one place:
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-16 p-8">
        <div className="max-w-[300px] bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:translate-y-[-10px] hover:shadow-2xl p-6">
          <img
            className="w-full h-[180px] object-cover"
            src="https://img.freepik.com/premium-vector/database-administrator-dbms-software-data-center-hosting-server_194360-382.jpg"
            alt="DBMS"
          />
          <h2 className="text-[#007bff] text-xl font-semibold mt-4">DBMS</h2>
          <p className="text-[#444] mt-2 text-sm">
            Get hands-on with SQL and understand how databases are designed and
            managed.
          </p>
          <a
            href="#"
            className="inline-block mt-4 px-6 py-2 text-white bg-gradient-to-r from-[#007bff] to-[#0056b3] rounded-md transition-colors duration-300 hover:bg-gradient-to-r hover:from-[#0056b3] hover:to-[#004494]"
          >
            Go To Course
          </a>
        </div>

        <div className="max-w-[300px] bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:translate-y-[-10px] hover:shadow-2xl p-6">
          <img
            className="w-full h-[180px] object-cover"
            src="https://img.freepik.com/free-vector/isometric-devops-illustration_52683-84175.jpg"
            alt="Python Programming"
          />
          <h2 className="text-[#007bff] text-xl font-semibold mt-4">
            Python Programming
          </h2>
          <p className="text-[#444] mt-2 text-sm">
            Start coding in Python and build projects in data science,
            automation, and AI.
          </p>
          <a
            href="#"
            className="inline-block mt-4 px-6 py-2 text-white bg-gradient-to-r from-[#007bff] to-[#0056b3] rounded-md transition-colors duration-300 hover:bg-gradient-to-r hover:from-[#0056b3] hover:to-[#004494]"
          >
            Go To Course
          </a>
        </div>

        <div className="max-w-[300px] bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:translate-y-[-10px] hover:shadow-2xl p-6">
          <img
            className="w-full h-[180px] object-cover"
            src="https://img.freepik.com/free-photo/hands-holding-neon-sign_23-2151922470.jpg"
            alt="Introduction to AI/ML"
          />
          <h2 className="text-[#007bff] text-xl font-semibold mt-4">
            Introduction to AI/ML
          </h2>
          <p className="text-[#444] mt-2 text-sm">
            Get an overview of AI and ML fundamentals with beginner-friendly
            projects.
          </p>
          <a
            href="#"
            className="inline-block mt-4 px-6 py-2 text-white bg-gradient-to-r from-[#007bff] to-[#0056b3] rounded-md transition-colors duration-300 hover:bg-gradient-to-r hover:from-[#0056b3] hover:to-[#004494]"
          >
            Go To Course
          </a>
        </div>

        <a href="#" className="self-center mt-8">
          <img
            className="w-16 h-16 transition-transform duration-200 hover:rotate-90 hover:scale-110"
            src={A}
            alt="Add more"
          />
        </a>
      </div>

      <div className="text-center mt-12 mb-8">
        <h2 className="text-[#0d1b2a] text-3xl font-semibold">
          Accelerate growth — using our tools:
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-16 px-8 py-8">
        <div className="w-full sm:w-[600px]">
          <img
            className="rounded-xl w-full h-auto"
            src={mobile}
            alt="Smart Platform"
          />
        </div>

        <div className="flex flex-col gap-8 max-w-[600px] w-full">
          <div className="flex bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:translate-x-2">
            <img
              className="w-24 p-4 object-contain"
              src={B}
              alt="Community"
            />
            <div className="p-6 flex-1">
              <h2 className="text-[#007bff] text-lg font-semibold">
                Explore Community based Learning
              </h2>
              <p className="mt-2 text-[#333]">
                Ask questions, share knowledge, grow together. Because learning
                is better when it’s shared.
              </p>
              <a
                href="#"
                className="mt-4 inline-block px-6 py-2 text-white bg-[#007bff] rounded-md transition-colors duration-300 hover:bg-[#0056b3]"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="flex bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:translate-x-2">
            <img
              className="w-24 p-4 object-contain"
              src={C}
              alt="AI Doubts"
            />
            <div className="p-6 flex-1">
              <h2 className="text-[#007bff] text-lg font-semibold">
                24/7 AI-assisted Doubt Solving
              </h2>
              <p className="mt-2 text-[#333]">
                Ask anything, anytime — no waiting, no barriers. Your personal
                tutor, always online.
              </p>
              <a
                href="#"
                className="mt-4 inline-block px-6 py-2 text-white bg-[#007bff] rounded-md transition-colors duration-300 hover:bg-[#0056b3]"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="flex bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:translate-x-2">
            <img
              className="w-24 p-4 object-contain"
              src={D}
              alt="Reviews"
            />
            <div className="p-6 flex-1">
              <h2 className="text-[#007bff] text-lg font-semibold">
                Course Reviews
              </h2>
              <p className="mt-2 text-[#333]">
                Real insights from real learners and mentors. Choose with
                confidence, learn with clarity.
              </p>
              <a
                href="#"
                className="mt-4 inline-block px-6 py-2 text-white bg-[#007bff] rounded-md transition-colors duration-300 hover:bg-[#0056b3]"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
