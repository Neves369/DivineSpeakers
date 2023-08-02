import React from "react";
import AppRoutes from "./app.routes";
import ReproduceAudio from "../components/reproduceAudio";

const Routes: React.FC = (children: any) => {
  return (
    <>
      <AppRoutes />
      <ReproduceAudio />
    </>
  );
};

export default Routes;
