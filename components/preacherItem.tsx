import { Image } from "expo-image";
import React, { useCallback } from "react";
import { ListItem, Text } from "@ui-kitten/components";
import { StyleSheet, View, ViewStyle } from "react-native";

export const PreacherItem = (props: any) => {
  const { message, onPress, ...listItemProps } = props;

  const renderMessageDate = (style: ViewStyle): React.ReactElement => (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText} appearance="hint" category="c1">
        {message.nascimento}
      </Text>
    </View>
  );

  const renderProfileAvatar = useCallback(
    (): React.ReactElement => (
      <Image
        cachePolicy={"disk"}
        style={styles.avatar}
        contentFit="fill"
        source={{ uri: message.foto }}
      />
    ),
    []
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
    borderWidth: 1,
    backgroundColor: "#969696fa",
    borderColor: "#ddd",
    borderBottomWidth: 1,
    borderBottomColor: "#fdf9f92f",
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
