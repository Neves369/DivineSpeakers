import { ToastAndroid } from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import AsyncStorage from "@react-native-async-storage/async-storage";

let Permission: any;

//salva o arquivo na memória
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
    return await FileSystem.getInfoAsync(ref).then((response: any) => {
      const { exists, uri } = response;
      if (exists) {
        FileSystem.getContentUriAsync(uri).then((cUri) => {
          console.log("aqui 1: ", cUri);

          setTimeout(() => {
            return cUri;
          }, 1000);

          //   IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          //     data: cUri,
          //     flags: 1,
          //     type: type == "pdf" ? "application/pdf+zip" : "audio/mp3",
          //   });
        });
      } else {
        return downloadFile(item, type);
      }
    });
  } else {
    return downloadFile(item, type);
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

    await FileSystem.getContentUriAsync(downloadResult?.uri).then((cUri) => {
      console.log("aqui: 2", cUri);
      return cUri;
      // IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      //   data: cUri,
      //   flags: 1,
      //   type: type == "pdf" ? "application/pdf+zip" : "audio/mp3",
      // });
    });
  } catch (error) {
    ToastAndroid.show(`${error}`, ToastAndroid.SHORT);
  }
};

export default verifyFile;
