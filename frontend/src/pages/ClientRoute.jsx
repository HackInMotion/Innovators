import React from "react";
import { Route, Routes } from "react-router-dom";
import ClientLayout from "./ClientLayout";
import Home from "./Home";
import AboutUs from "./aboutus";
import ContactUs from "./contactus";
import Communities from "./communities";
import Courses from "./courses";
import FAQ from "./faq";
import ITCareerRoadmaps from "./RoadMap";
import CodeCompiler from "../components/Compiler";
import StudentEngagementChart from '../components/StudentEngagementChart'
import QuizContest from "./QuizContest";


const ClientRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/analytics" element={<StudentEngagementChart />} />
        <Route path="/road-map" element={<ITCareerRoadmaps />} />
        <Route path="/compiler" element={<CodeCompiler />} />
        <Route path="/quiz-contest" element={<QuizContest />} />
      </Route>
    </Routes>
  );
};

export default ClientRoute;
