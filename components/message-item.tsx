import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Avatar, ListItem, Text } from "@ui-kitten/components";

export const MessageItem = (props: any) => {
  const { message, onPress, ...listItemProps } = props;

  const renderMessageDate = (style: ViewStyle): React.ReactElement => (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText} appearance="hint" category="c1">
        {message._data.nascimento}
      </Text>
    </View>
  );

  const renderProfileAvatar = (): React.ReactElement => (
    <Avatar
      style={styles.avatar}
      resizeMode="contain"
      source={{ uri: message._data.foto }}
    />
  );

  return (
    <ListItem
      {...listItemProps}
      onPress={onPress}
      title={message._data.nome}
      description={message._data.titulo}
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
