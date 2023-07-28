import React, { useContext } from "react";
// import AuthContext from "../contexts/auth";
import AppRoutes from "./app.routes";
// import AuthRoutes from "./auth.routes";
// import { Snackbar } from "react-native-paper";

const Routes: React.FC = () => {
  // const { signed, error, hideMessage, showError }: any =
  //   useContext(AuthContext);

  return (
    <>
      <AppRoutes />
      {/* <Snackbar
        visible={showError}
        onDismiss={() => {}}
        action={{
          label: "Fechar",
          onPress: () => {
            hideMessage();
          },
        }}
      >
        {error}
      </Snackbar> */}
    </>
  );
};

export default Routes;
