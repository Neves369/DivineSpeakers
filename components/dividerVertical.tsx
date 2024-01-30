import React from "react";
import { View, StyleSheet } from "react-native";

const DividerVertical: React.FC = () => {
  return <View style={styles.div} />;
};

export default DividerVertical;

const styles = StyleSheet.create({
  div: {
    marginVertical: 8,
    borderLeftWidth: 1,
    borderLeftColor: "#80808027",
  },
});
