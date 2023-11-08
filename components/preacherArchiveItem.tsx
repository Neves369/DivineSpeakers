import React from "react";
import { ListItem } from "@ui-kitten/components";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export const ArchiveItem = (props: any) => {
  const { message, onPress, ...listItemProps } = props;

  const renderProfileAvatar = (): React.ReactElement =>
    message.name.toLowerCase().endsWith(`pdf`) ? (
      <FontAwesome name="file-pdf-o" size={20} color="gray" />
    ) : (
      <MaterialIcons name="multitrack-audio" size={24} color="gray" />
    );

  return (
    <ListItem
      {...listItemProps}
      onPress={onPress}
      title={message.name.substr(0, message.name.length - 4)}
      accessoryLeft={renderProfileAvatar}
    />
  );
};
