import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ToastAndroid,
  Modal,
  Platform,
} from "react-native";
import {
  Avatar,
  Layout,
  Text,
  Button,
  List,
  Card,
  Spinner,
} from "@ui-kitten/components";
import { Audio } from "expo-av";
import WebView from "react-native-webview";
import { AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import storage from "@react-native-firebase/storage";
import DownloadFile from "../components/downloadFile";
import { ArchiveItem } from "../components/archive-item";

const Archive = ({ route, navigation }: any) => {
  const [screen, setScreen] = useState(0);
  const sound = useRef(new Audio.Sound());
  const [audios, setAudios] = useState<any>([]);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [archives, setArchives] = useState<any>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadedAudio, setLoadedAudio] = useState(false);
  const [autor, setAutor] = useState(route.params._data);
  const [selectedAudio, setSelectedAudio] = useState<any>();

  useEffect(() => {
    if (screen == 1 || screen == 2) {
      listDocumentsInFolder(`/${autor.ref}`);
    }
  }, [screen]);

  useEffect(() => {
    if (loadedAudio) {
      setVisible(true);
    }
  }, [loadedAudio]);

  async function listDocumentsInFolder(folderPath: string) {
    setIsLoading(true);
    try {
      const reference = storage().ref(folderPath);
      const listResult = await reference.listAll();

      let filterDocs = await separateDocs(listResult, "pdf");
      let filterAudios = await separateDocs(listResult, "mp3");

      setArchives(filterDocs);
      setAudios(filterAudios);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.show(`${error}`, ToastAndroid.SHORT);
      console.error("Error listing documents: ", error);
    }
  }

  const separateDocs = async (array: any, ends: string) => {
    const filter = array.items.filter((item: any) => {
      return item.name.toLowerCase().endsWith(`.${ends}`);
    });

    const docs = await Promise.all(
      filter.map(async (item: any) => {
        return {
          name: item.name,
          fullPath: item.fullPath,
          downloadURL: await item.getDownloadURL(),
        };
      })
    );
    return docs;
  };

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

  const loadAudio = async (item: any) => {
    setSelectedAudio(item);
    const checkLoading = await sound.current.getStatusAsync();
    if (checkLoading.isLoaded === false) {
      try {
        const result = await sound.current.loadAsync({
          uri: item.downloadURL,
        });

        if (result.isLoaded === false) {
          console.error("Error in Loading Audio");
        } else {
          setLoadedAudio(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const PlayAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === false) {
          sound.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const PauseAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          sound.current.pauseAsync();
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const CloseAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        sound.current.unloadAsync();
        setSelectedAudio(null);
        setLoadedAudio(false);
        setIsPlaying(false);
        setVisible(false);
      }
    } catch (error) {
      setVisible(false);
      console.error(error);
    }
  };

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <ArchiveItem
        style={styles.item}
        message={item}
        onPress={() => {
          item.name.substr(-3) == "pdf" ? DownloadFile(item) : loadAudio(item);
        }}
      />
    );
  }, []);

  return (
    <>
      {renderHeader()}

      {screen == 0 ? (
        <ScrollView>
          <Card style={{ margin: 7 }} disabled>
            <WebView
              style={{
                height: 300,
                width: "100%",
                backgroundColor: "black",
              }}
              javaScriptEnabled={true}
              scrollEnabled={false}
              allowsFullscreenVideo={false}
              source={{
                uri: `https://www.youtube.com/embed/${autor.video}?&autoplay=0&mute=0&showinfo=0&controls=1&fullscreen=1`,
              }}
            />
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
          ListEmptyComponent={
            <View
              style={{
                width: "100%",
                height: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isLoading ? (
                <Spinner status="warning" />
              ) : (
                <Text style={{ textAlign: "center", color: "grey" }}>
                  Nenhum arquivo de texto para esse autor
                </Text>
              )}
            </View>
          }
        />
      ) : screen == 2 ? (
        <>
          <List
            style={styles.list}
            data={audios}
            renderItem={renderItem}
            ListEmptyComponent={
              <View
                style={{
                  width: "100%",
                  height: 25,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isLoading ? (
                  <Spinner status="warning" />
                ) : (
                  <Text style={{ textAlign: "center", color: "grey" }}>
                    Nenhum arquivo de áudio para esse autor
                  </Text>
                )}
              </View>
            }
          />
          <Modal visible={visible} transparent>
            <Card
              style={{ position: "absolute", bottom: 0, width: "100%" }}
              disabled={true}
            >
              <AntDesign
                onPress={() => {
                  CloseAudio();
                }}
                style={{ position: "absolute", right: 0 }}
                name="closecircle"
                size={24}
                color="black"
              />
              <Text>{selectedAudio?.name}</Text>
              <View
                style={{ marginTop: 20, width: "100%", flexDirection: "row" }}
              >
                {isPlaying ? (
                  <AntDesign
                    onPress={() => {
                      PauseAudio();
                    }}
                    style={{ flex: 1 }}
                    name="pausecircle"
                    size={24}
                    color="black"
                  />
                ) : (
                  <AntDesign
                    onPress={() => {
                      PlayAudio();
                    }}
                    style={{ flex: 1 }}
                    name="play"
                    size={24}
                    color="black"
                  />
                )}
                <Slider
                  style={{ flex: 10 }}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#000000"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#000000"
                />
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: 9, marginTop: 5 }}>
                    {"00:00/00:00"}
                  </Text>
                </View>
              </View>
            </Card>
          </Modal>
        </>
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
