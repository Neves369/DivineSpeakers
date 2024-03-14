import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  AppState,
  Linking,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import {
  Layout,
  Text,
  Button,
  List,
  Card,
  Spinner,
} from "@ui-kitten/components";
import { Image } from "expo-image";
import storage from "@react-native-firebase/storage";
import YoutubePlayer from "react-native-youtube-iframe";
import useColorScheme from "../../hooks/useColorScheme";
import DownloadFile from "../../components/downloadFile";
import DividerVertical from "../../components/dividerVertical";
import { ArchiveItem } from "../../components/preacherArchiveItem";
import AuthContext from "../../context/auth";
import spotify from "../../hooks/spotify";

const PreacherArchive = ({ route, navigation }: any) => {
  const [screen, setScreen] = useState(0);
  const [audios, setAudios] = useState<any>([]);
  const [autor, setAutor] = useState(route.params);
  const [isLoading, setIsLoading] = useState(false);
  const [archives, setArchives] = useState<any>([]);
  const [videoReady, setVideoReady] = useState(false);
  const [isReadyForRender, setIsReadyForRender] = useState(false);
  const { changePdfUrl }: any = useContext(AuthContext);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (screen == 1 || screen == 2) {
      if (archives.length == 0 && audios.length == 0) {
        listDocumentsInFolder(`/${autor.ref}`);
      }
    }

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [screen]);

  async function listDocumentsInFolder(folderPath: string) {
    setIsLoading(true);

    try {
      const reference = storage().ref(folderPath);
      const listResult = await reference.listAll();
      let keys = Object.keys(autor.audios);
      keys = keys.sort();
      let filterDocs = await separateDocs(listResult, "pdf");

      setAudios(keys);
      setArchives(filterDocs);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
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
          <Image
            cachePolicy={"disk"}
            style={styles.profileAvatar}
            contentFit="fill"
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
        <Layout
          level="1"
          style={{ height: 50, flexDirection: "row", elevation: 5 }}
        >
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
          <DividerVertical />
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
          <DividerVertical />
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
          source={autor.capa}
          cachePolicy={"disk"}
          style={{
            backgroundColor: "black",
            height: 250,
            width: "100%",
            position: "absolute",
            top: -20,
            zIndex: -999,
          }}
        />
        <View
          style={{
            backgroundColor: "#0000004d",
            height: 250,
            width: "100%",
            position: "absolute",
            top: -20,
          }}
        />
      </>
    );
  };

  function onReady() {
    setIsReadyForRender(true);
    setVideoReady(true);
  }

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <ArchiveItem
        style={styles.item}
        message={typeof item == "string" ? item : item.name}
        onPress={() => {
          // interstitial.show();
          // setTimeout(() => {
          typeof item == "string"
            ? Linking.openURL(autor.audios[item] + "?autoplay=true&play=0")
            : changePdfUrl(item);
          // }, 1000);
        }}
      />
    );
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: useColorScheme() == "light" ? "#FFFFFF" : "#1A2138",
      }}
    >
      {renderHeader()}

      {screen == 0 ? (
        <ScrollView>
          {autor.video !== "" ? (
            <Card style={{ margin: 7, elevation: 1 }} disabled>
              <YoutubePlayer
                height={200}
                videoId={autor.video}
                onReady={() => onReady()}
                webViewStyle={{
                  opacity: 0.99,
                  display: isReadyForRender ? "flex" : "none",
                }}
                webViewProps={{
                  androidLayerType: isReadyForRender ? "hardware" : "software",
                }}
              />
              {!videoReady && <ActivityIndicator color="red" />}
            </Card>
          ) : (
            ""
          )}
          <Card style={{ margin: 7, elevation: 1 }}>
            <Text style={{ textAlign: "justify" }}>{autor.descricao}</Text>
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
      ) : (
        <></>
      )}
    </View>
  );
};

export default PreacherArchive;

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
    width: 40,
    height: 40,

    borderRadius: 20,
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
    elevation: 1,
    margin: 5,
    borderRadius: 5,
  },
});
