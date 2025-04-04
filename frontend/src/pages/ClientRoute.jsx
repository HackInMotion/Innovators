import React from "react";
import { Route, Routes } from "react-router-dom";
import ClientLayout from "./ClientLayout";
import Home from "./Home";

const ClientRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
};

export default ClientRoute;
