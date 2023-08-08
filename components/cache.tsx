import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeDataInCache = async (data: any, cacheKey: string) => {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.error("Error storing data in cache:", error);
  }
};

export const retrieveDataFromCache = async (cacheKey: string) => {
  try {
    const cachedData: any = await AsyncStorage.getItem(cacheKey);
    return JSON.parse(cachedData);
  } catch (error) {
    console.error("Error retrieving data from cache:", error);
    return null;
  }
};

export const clearCache = async () => {
  try {
    const keys = ["caroussel"];
    await AsyncStorage.multiRemove(keys).then(() => {
      console.log("clear");
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};
