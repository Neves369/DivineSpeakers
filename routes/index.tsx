import React, { useContext } from "react";
// import AuthContext from "../contexts/auth";
import AppRoutes from "./app.routes";
// import AuthRoutes from "./auth.routes";

const Routes: React.FC = () => {
  // const { signed, error, hideMessage, showError }: any =
  //   useContext(AuthContext);

  return (
    <>
      <AppRoutes />
    </>
  );
};

export default Routes;
