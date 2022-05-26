import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorShow from "./ErrorShow";
import Login from "./Login/Login";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="error" element={<ErrorShow />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
