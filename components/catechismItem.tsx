import { Image } from "expo-image";
import React, { useCallback } from "react";
import { ListItem, Text } from "@ui-kitten/components";
import { StyleSheet, View, ViewStyle } from "react-native";

export const CatchismItem = (props: any) => {
  const { message, onPress, ...listItemProps } = props;

  const renderMessageDate = (style: ViewStyle): React.ReactElement => (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText} appearance="hint" category="c1">
        {message.ano}
      </Text>
    </View>
  );

  return (
    <ListItem
      {...listItemProps}
      onPress={onPress}
      title={message.titulo}
      description={message.autor}
      accessoryRight={renderMessageDate}
    />
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    textAlign: "right",
    minWidth: 64,
  },
});
