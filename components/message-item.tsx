import React from "react";
import { Image } from "expo-image";
import { ListItem, Text } from "@ui-kitten/components";
import { StyleSheet, View, ViewStyle } from "react-native";

export const MessageItem = (props: any) => {
  const { message, onPress, ...listItemProps } = props;

  const renderMessageDate = (style: ViewStyle): React.ReactElement => (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText} appearance="hint" category="c1">
        {message.nascimento}
      </Text>
    </View>
  );

  const renderProfileAvatar = (): React.ReactElement => (
    <Image
      cachePolicy={"disk"}
      style={styles.avatar}
      contentFit="fill"
      source={{ uri: message.foto }}
    />
  );

  return (
    <ListItem
      {...listItemProps}
      onPress={onPress}
      title={message.nome}
      description={message.titulo}
      accessoryLeft={renderProfileAvatar}
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
