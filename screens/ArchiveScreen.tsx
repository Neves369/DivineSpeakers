import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import {
  Avatar,
  Layout,
  Text,
  Button,
  List,
  Card,
} from "@ui-kitten/components";
import WebView from "react-native-webview";
import { Video, ResizeMode } from "expo-av";
import storage from "@react-native-firebase/storage";
import { ArchiveItem } from "../components/archive-item";
import DownloadFile from "../components/downloadFile";

const Archive = ({ route, navigation }: any) => {
  const [screen, setScreen] = useState(0);
  const [audios, setAudios] = useState<any>([]);
  const [archives, setArchives] = useState<any>([]);
  const [autor, setAutor] = useState(route.params._data);

  useEffect(() => {
    listDocumentsInFolder(`/${autor.ref}`, "pdf");
  }, [screen]);

  async function listDocumentsInFolder(folderPath: string, ends: string) {
    try {
      const reference = storage().ref(folderPath);
      const listResult = await reference.listAll();

      const filter = listResult.items.filter((item) => {
        return item.name.toLowerCase().endsWith(`.${ends}`);
      });

      const docs = await Promise.all(
        filter.map(async (item) => {
          return {
            name: item.name,
            fullPath: item.fullPath,
            downloadURL: await item.getDownloadURL(),
          };
        })
      );
      setArchives(docs);
    } catch (error) {
      console.error("Error listing documents:", error);
    }
  }

  const renderHeader = () => {
    return (
      <>
        <Layout style={styles.header} level="1">
          <Avatar
            style={styles.profileAvatar}
            size="giant"
            resizeMode="contain"
            source={{ uri: autor.foto }}
          />
          <View style={styles.profileDetailsContainer}>
            <Text category="h4">{autor.nome}</Text>
            <Text appearance="hint" category="s1">
              {autor.titulo}
            </Text>
            <View style={styles.profileSocialsContainer}></View>
          </View>
        </Layout>
        <Layout level="1" style={{ height: 50, flexDirection: "row" }}>
          <Button
            onPress={() => {
              setScreen(0);
            }}
            style={{ flex: 1 }}
            appearance={screen == 0 ? "outline" : "ghost"}
            status={screen == 0 ? "info" : "basic"}
          >
            Resumo
          </Button>
          <Button
            onPress={() => {
              setScreen(1);
            }}
            style={{ flex: 1 }}
            appearance={screen == 1 ? "outline" : "ghost"}
            status={screen == 1 ? "info" : "basic"}
          >
            Arquivos
          </Button>
          <Button
            onPress={() => {
              setScreen(2);
            }}
            style={{ flex: 1 }}
            appearance={screen == 2 ? "outline" : "ghost"}
            status={screen == 2 ? "info" : "basic"}
          >
            Áudios
          </Button>
        </Layout>
        <Image
          source={{
            uri: autor.capa,
          }}
          style={{
            backgroundColor: "black",
            height: 250,
            width: "100%",
            position: "absolute",
            top: -20,
            zIndex: -999,
          }}
        />
      </>
    );
  };

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <ArchiveItem
        style={styles.item}
        message={item}
        type={screen}
        onPress={() => {
          console.log(item.name.substr(-3));
          item.name.substr(-3) == "pdf"
            ? DownloadFile(item)
            : console.log("audio");
        }}
      />
    );
  }, []);

  return (
    <>
      {renderHeader()}

      {screen == 0 ? (
        <ScrollView>
          <Card style={{ margin: 7 }}>
            <Video
              // ref={video}
              style={{
                height: 300,
                width: "100%",
                backgroundColor: "black",
                borderRadius: 8,
              }}
              source={{
                uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
            {/* <WebView
              style={{
                height: 300,
                width: "100%",
                backgroundColor: "black",
                borderRadius: 8,
              }}
              javaScriptEnabled={true}
              source={{
                uri: "https://www.youtube.com/watch?v=VThA4QOLF_I",
              }}
            /> */}
          </Card>
          <Card style={{ margin: 7 }}>
            <Text>{autor.descricao}</Text>
          </Card>
        </ScrollView>
      ) : screen == 1 ? (
        <List
          style={styles.list}
          data={archives}
          renderItem={renderItem}
          ListEmptyComponent={<></>}
        />
      ) : screen == 2 ? (
        <List
          style={styles.list}
          data={audios}
          renderItem={renderItem}
          ListEmptyComponent={<></>}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Archive;

const styles = StyleSheet.create({
  list: {
    flex: 1,
    margin: 7,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  header: {
    backgroundColor: "rgba(0,0,0,0)",
    flexDirection: "row",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingTop: 240,
    marginBottom: 8,
  },
  profileAvatar: {
    marginHorizontal: 8,
    elevation: 10,
  },
  profileDetailsContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  profileSocialsContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  profileSocialContainer: {
    flex: 1,
  },
  followButton: {
    marginVertical: 16,
  },
  post: {
    margin: 8,
  },
  postHeader: {
    height: 220,
  },
  postBody: {
    flexDirection: "row",
    marginHorizontal: -8,
  },
  postAuthorContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  iconButton: {
    flexDirection: "row-reverse",
    paddingHorizontal: 0,
  },
  item: {
    paddingVertical: 16,
  },
});
