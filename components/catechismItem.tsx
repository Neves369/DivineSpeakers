import { Image } from "expo-image";
import React, { useCallback } from "react";
import { ListItem, Text } from "@ui-kitten/components";
import { StyleSheet, View, ViewStyle } from "react-native";

export const CatchismItem = (props: any) => {
  const { message, onPress, ...listItemProps } = props;

  console.log(onPress);

  const renderMessageDate = (style: ViewStyle): React.ReactElement => (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText} appearance="hint" category="c1">
        {message.ano}
      </Text>
    </View>
  );

  // const renderProfileAvatar = useCallback(
  //   (): React.ReactElement => (
  //     <Image
  //       cachePolicy={"disk"}
  //       style={styles.avatar}
  //       contentFit="fill"
  //       source={{ uri: "" }}
  //     />
  //   ),
  //   []
  // );

  return (
    <ListItem
      {...listItemProps}
      onPress={onPress}
      title={message.titulo}
      description={message.autor}
      // accessoryLeft={renderProfileAvatar}
      accessoryRight={renderMessageDate}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    textAlign: "right",
    minWidth: 64,
  },
});
