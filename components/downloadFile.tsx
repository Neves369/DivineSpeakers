import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

let Permission: any;
let OfflinePdf: any;

//salva o arquivo na memória
const saveAndroidFile = async (fileUri: any, fileName: any) => {
  try {
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
        .catch((e: string) => {});
    } catch (e) {}
  } catch (err) {}
};

//faz o download do arquivo
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
      return console.log("erro");
    }

    await saveAndroidFile(downloadResult?.uri, item.name);
    Sharing.shareAsync(downloadResult?.uri, {
      dialogTitle: "Abrir com...",
      mimeType: "application/pdf",
    });
  } catch (error) {
    console.error("Erro ao baixar o arquivo:", error);
  }
};

export default downloadFile;
