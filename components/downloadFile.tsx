import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";

let Permission: any;

//salva o arquivo na memória
const saveAndroidFile = async (fileUri: any, fileName: any) => {
  try {
    await AsyncStorage.setItem("OfflinePDF" + fileName, fileUri as string);

    const fileString = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    try {
      const directoryUri = await AsyncStorage.getItem("permissionDirectoryUrl");
      if (!directoryUri) {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          return;
        } else {
          await AsyncStorage.setItem(
            "permissionDirectoryUrl",
            permissions.directoryUri
          );
          Permission = permissions.directoryUri;
        }
      } else {
        Permission = directoryUri;
      }
      await FileSystem.StorageAccessFramework.createFileAsync(
        Permission,
        fileName,
        "application/pdf+zip"
      )
        .then(async (uri: string) => {
          await FileSystem.writeAsStringAsync(uri, fileString, {
            encoding: FileSystem.EncodingType.Base64,
          });
        })
        .catch((e: string) => {
          ToastAndroid.show(`${e}`, ToastAndroid.SHORT);
        });
    } catch (e) {
      ToastAndroid.show(`${e}`, ToastAndroid.SHORT);
    }
  } catch (err) {
    ToastAndroid.show(`${err}`, ToastAndroid.SHORT);
  }
};

//faz o download do arquivo
const verifyFile = async (item: any) => {
  let ref = await AsyncStorage.getItem("OfflinePDF" + item.name);
  if (ref) {
    await FileSystem.getInfoAsync(ref).then((response) => {
      const { exists, uri } = response;
      if (exists) {
        Sharing.shareAsync(uri, {
          dialogTitle: "Abrir com...",
          mimeType: "application/pdf",
        });
      } else {
        downloadFile(item);
      }
    });
  } else {
    downloadFile(item);
  }
};

const downloadFile = async (item: any) => {
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
      return console.error("error");
    }

    await saveAndroidFile(downloadResult?.uri, item.name);

    Sharing.shareAsync(downloadResult?.uri, {
      dialogTitle: "Abrir com...",
      mimeType: "application/pdf",
    });
  } catch (error) {
    ToastAndroid.show(`${error}`, ToastAndroid.SHORT);
  }
};

export default verifyFile;
