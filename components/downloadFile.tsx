import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid, Share } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";

let Permission: any;

//salva o arquivo na memória
const saveAndroidFile = async (fileUri: any, fileName: any, type: string) => {
  try {
    await AsyncStorage.setItem(
      type == "pdf" ? "OfflinePDF" + fileName : "OfflineMP3" + fileName,
      fileUri as string
    );

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
        type == "pdf" ? "application/pdf+zip" : "audio/mp3"
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
const verifyFile = async (item: any, type: string) => {
  let ref = await AsyncStorage.getItem(
    type == "pdf" ? "OfflinePDF" + item.name : "OfflineMP3" + item.name
  );
  if (ref) {
    await FileSystem.getInfoAsync(ref).then((response) => {
      const { exists, uri } = response;
      if (exists) {
        // Sharing.shareAsync(uri, {
        //   dialogTitle: "Abrir com...",
        //   mimeType: "application/pdf",
        // });
        FileSystem.getContentUriAsync(uri).then((cUri) => {
          IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: cUri,
            flags: 1,
            type: type == "pdf" ? "application/pdf+zip" : "audio/mp3",
          });
        });
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

    // Sharing.shareAsync(downloadResult?.uri, {
    //   dialogTitle: "Abrir com...",
    //   mimeType: "application/pdf",
    // });
    await FileSystem.getContentUriAsync(downloadResult?.uri).then((cUri) => {
      IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: cUri,
        flags: 1,
        type: type == "pdf" ? "application/pdf+zip" : "audio/mp3",
      });
    });
  } catch (error) {
    ToastAndroid.show(`${error}`, ToastAndroid.SHORT);
  }
};

export default verifyFile;
