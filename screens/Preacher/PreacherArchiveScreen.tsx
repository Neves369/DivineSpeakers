import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import {
  Layout,
  Text,
  Button,
  List,
  Card,
  Spinner,
  Divider,
} from "@ui-kitten/components";
import { Image } from "expo-image";
import storage from "@react-native-firebase/storage";
import YoutubePlayer from "react-native-youtube-iframe";
import DownloadFile from "../../components/downloadFile";
import { ArchiveItem } from "../../components/preacherArchiveItem";
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";

const interstitial = InterstitialAd.createForAdRequest(
  "ca-app-pub-9187411594153289/4560480625",
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

const PreacherArchive = ({ route, navigation }: any) => {
  const [screen, setScreen] = useState(0);
  const [audios, setAudios] = useState<any>([]);
  const [autor, setAutor] = useState(route.params);
  const [isLoading, setIsLoading] = useState(false);
  const [archives, setArchives] = useState<any>([]);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeInterstitialEvents = loadInterstitial();
    if (screen == 1 || screen == 2) {
      if (archives.length == 0 && audios.length == 0) {
        listDocumentsInFolder(`/${autor.ref}`);
      }
    }

    return () => {
      unsubscribeInterstitialEvents();
    };
  }, [screen]);

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
      </>
    );
  };

  const loadInterstitial = () => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        interstitial.load();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeClosed();
      unsubscribeLoaded();
    };
  };

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <ArchiveItem
        style={styles.item}
        message={item}
        onPress={() => {
          interstitial.show();
          setTimeout(() => {
            item.name.substr(-3) == "pdf"
              ? DownloadFile(item, "pdf")
              : DownloadFile(item, "mp3");
          }, 3000);
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
            <YoutubePlayer height={200} videoId={autor.video} />
          </Card>
          <Card style={{ margin: 7 }}>
            <Text style={{ textAlign: "justify" }}>{autor.descricao}</Text>
          </Card>
        </ScrollView>
      ) : screen == 1 ? (
        <List
          style={styles.list}
          data={archives}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
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
    </>
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
  },
});
