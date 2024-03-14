import Pdf from "react-native-pdf";
import AuthContext from "../context/auth";
import { Button, Text } from "@ui-kitten/components";
import * as FileSystem from "expo-file-system";
import { AntDesign } from "@expo/vector-icons";
import * as IntentLauncher from "expo-intent-launcher";
import React, { memo, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dimensions,
  Modal,
  StyleSheet,
  View,
  ToastAndroid,
} from "react-native";

const PdfModal: React.FC = () => {
  const [url, setUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [lastLocation, setLastLocation] = useState(1);
  const { pdfUrl, changePdfUrl }: any = useContext(AuthContext);

  useEffect(() => {
    if (pdfUrl !== "") {
      setLastLocation(1);
      verifyFile(pdfUrl, "pdf");
    }
    loadStorageData(pdfUrl);
  }, [pdfUrl]);

  async function loadStorageData(pdf: any) {
    if (pdf) {
      let storageLocation = await AsyncStorage.getItem(pdf.name);
      if (storageLocation) {
        setLastLocation(+storageLocation);
      }
    }
  }

  //salva no dispositivo para não fazer download toda hora
  const saveAndroidFile = async (fileUri: any, fileName: any, type: string) => {
    try {
      await AsyncStorage.setItem(
        type == "pdf" ? "OfflinePDF" + fileName : "OfflineMP3" + fileName,
        fileUri as string
      );
    } catch (err) {
      ToastAndroid.show(`${err}`, ToastAndroid.SHORT);
    }
  };

  //tenta recuperar da memória
  const verifyFile = async (item: any, type: string) => {
    let ref = await AsyncStorage.getItem(
      type == "pdf" ? "OfflinePDF" + item.name : "OfflineMP3" + item.name
    );

    if (ref) {
      await FileSystem.getInfoAsync(ref).then((response: any) => {
        const { exists, uri } = response;
        if (exists) {
          FileSystem.readAsStringAsync(uri, { encoding: "base64" }).then(
            (cUri) => {
              setUrl(cUri);
            }
          );
        } else {
          downloadFile(item, type);
        }
      });
    } else {
      downloadFile(item, type);
    }
  };

  //faz download do arquivo
  const downloadFile = async (item: any, type: string) => {
    const downloadResumable = FileSystem.createDownloadResumable(
      item.downloadURL,
      FileSystem.documentDirectory + item.name,
      {
        cache: true,
      }
    );
    try {
      const downloadResult = await downloadResumable.downloadAsync();

      if (downloadResult?.status != 200) {
        return ToastAndroid.show(
          "Não foi possível fazer o download!",
          ToastAndroid.SHORT
        );
      }

      await saveAndroidFile(downloadResult?.uri, item.name, type);

      await FileSystem.readAsStringAsync(downloadResult?.uri, {
        encoding: "base64",
      }).then((cUri) => {
        setUrl(cUri);
      });
    } catch (error) {
      ToastAndroid.show(`${error}`, ToastAndroid.SHORT);
    }
  };

  const onChangePage = async (page: any) => {
    setCurrentPage(page);
    await AsyncStorage.setItem(pdfUrl.name, String(page));
  };

  return (
    <Modal
      statusBarTranslucent={true}
      visible={url !== "" && url != undefined ? true : false}
    >
      <View style={styles.modalHeader}>
        <AntDesign
          name="closecircle"
          size={30}
          color="white"
          onPress={() => {
            setUrl("");
            changePdfUrl("");
            setLastLocation(currentPage);
          }}
        />
        <Text numberOfLines={1} style={{ color: "white", marginBottom: 5 }}>
          {pdfUrl.name?.split(".").shift()}
        </Text>
      </View>

      {url ? (
        <Pdf
          page={lastLocation}
          trustAllCerts={false}
          source={{
            uri: `data:application/pdf;base64,${url}`,
          }}
          enableAnnotationRendering
          onLoadComplete={(numberOfPages, filePath) => {
            setNumberOfPages(numberOfPages);
          }}
          onPageChanged={(page, numberOfPages) => {
            onChangePage(page);
          }}
          onError={(error) => {
            console.log(error);
          }}
          style={styles.pdf}
        />
      ) : (
        <></>
      )}
      <View style={styles.modalFooter}>
        <Text
          style={{ color: "white" }}
        >{`Página ${currentPage}/${numberOfPages}`}</Text>
      </View>
    </Modal>
  );
};

export default memo(PdfModal);

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  modalFooter: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    gap: 15,
    height: 80,
    width: "100%",
    paddingLeft: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
