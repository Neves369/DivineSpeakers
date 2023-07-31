import React from "react";
import { ListItem, Text } from "@ui-kitten/components";
import { StyleSheet, View, ViewStyle } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export const ArchiveItem = (props: any) => {
  const { message, onPress, type, ...listItemProps } = props;

  const renderMessageDate = (style: ViewStyle): React.ReactElement => (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText} appearance="hint" category="c1">
        {message._data.nascimento}
      </Text>
    </View>
  );

  const renderProfileAvatar = (): React.ReactElement =>
    type == 0 ? (
      <FontAwesome name="file-pdf-o" size={24} color="gray" />
    ) : (
      <MaterialIcons name="multitrack-audio" size={24} color="gray" />
    );

  return (
    <ListItem
      {...listItemProps}
      onPress={onPress}
      title={message.name}
      accessoryLeft={renderProfileAvatar}
      // accessoryRight={renderMessageDate}
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
