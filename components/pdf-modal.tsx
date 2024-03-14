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
  const { pdfUrl, changePdfUrl }: any = useContext(AuthContext);

  useEffect(() => {
    if (pdfUrl !== "") {
      verifyFile(pdfUrl, "pdf");
      console.log("entrou: ", url);
    }
  }, [pdfUrl]);

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

  //faz o download do arquivo
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

  return (
    <Modal
      statusBarTranslucent={true}
      visible={url !== "" && url != undefined ? true : false}
    >
      <View style={styles.modalHeader}>
        <AntDesign
          // style={{ position: "absolute", top: 40, right: 0, zIndex: 999 }}
          name="closecircle"
          size={30}
          color="white"
          onPress={() => {
            setUrl("");
            changePdfUrl("");
          }}
        />
      </View>

      {url ? (
        <Pdf
          trustAllCerts={false}
          source={{
            uri: `data:application/pdf;base64,${url}`,
          }}
          enableAnnotationRendering
          onLoadComplete={(numberOfPages, filePath) => {
            setNumberOfPages(numberOfPages);
          }}
          onPageChanged={(page, numberOfPages) => {
            setCurrentPage(page);
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
    paddingBottom: 10,
    height: 80,
    width: "100%",
    paddingLeft: 10,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
