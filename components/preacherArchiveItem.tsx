import React from "react";
import { ListItem } from "@ui-kitten/components";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export const ArchiveItem = (props: any) => {
  const { message, onPress, ...listItemProps } = props;

  const renderProfileAvatar = (): React.ReactElement =>
    message.toLowerCase().endsWith(`pdf`) ? (
      <FontAwesome name="file-pdf-o" size={20} color="gray" />
    ) : (
      <MaterialIcons name="multitrack-audio" size={24} color="gray" />
    );

  return (
    <ListItem
      {...listItemProps}
      onPress={onPress}
      title={
        message.toLowerCase().endsWith(`pdf`)
          ? message.substr(0, message.length - 4)
          : message
      }
      accessoryLeft={renderProfileAvatar}
    />
  );
};
