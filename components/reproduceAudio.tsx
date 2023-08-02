import React, { useContext, useEffect, useRef, useState } from "react";
import { AppState, View } from "react-native";
import { Text, Card } from "@ui-kitten/components";
import { Audio } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import AuthContext from "../context/auth";

const ReproduceAudio = () => {
  const sound = useRef(new Audio.Sound());
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadedAudio, setLoadedAudio] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [selectedAudio, setSelectedAudio] = useState<any>();
  const [visibleMusicCard, setVisibleMusicCard] = useState(false);
  const { audio, changeSelectAudio }: any = useContext(AuthContext);
  const appState = useRef(AppState.currentState);

  const handleAppStateChange = async (nextAppState: any) => {
    console.log(nextAppState);

    // if (
    //   appState.current.match(/inactive|background/) &&
    //   nextAppState === "active"
    // ) {
    //   const elapsed = await getElapsedTime();

    //   if (elapsed < timerCount) {
    //     setTimer(timerCount - elapsed);
    //   } else {
    //     setTimer(0);
    //   }
    //   setElapsed(elapsed);
    // }
    // appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (audio != null) {
      loadAudio(audio);
    }
  }, [audio]);

  useEffect(() => {
    if (loadedAudio) {
      setVisibleMusicCard(true);
    }
  }, [loadedAudio]);

  useEffect(() => {
    if (loadedAudio && isPlaying) {
      let interval = setInterval(() => {
        if (currentPosition >= 0) {
          sound.current.getStatusAsync().then((teste: any) => {
            setCurrentPosition(
              parseInt((teste.positionMillis / 1000).toFixed(0))
            );
          });
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentPosition, loadedAudio, isPlaying]);

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
          //@ts-ignore
          setDuration(parseInt((result.durationMillis / 1000).toFixed(0)));
          setLoadedAudio(true);
          //   Audio.setAudioModeAsync({ staysActiveInBackground: true });
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
        setVisibleMusicCard(false);
        setDuration(0);
        setCurrentPosition(0);
        changeSelectAudio(null);
      }
    } catch (error) {
      setVisibleMusicCard(false);
      console.error(error);
    }
  };

  const handleJumpToMillis = async (millis: any) => {
    console.log(parseInt(millis) * 1000);
    if (sound.current !== null && millis != 0) {
      await sound.current.setPositionAsync(parseInt(millis) * 1000);
    }
  };

  if (visibleMusicCard) {
    return (
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
        <View style={{ marginTop: 20, width: "100%", flexDirection: "row" }}>
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
            style={{ flex: 7 }}
            minimumValue={0}
            maximumValue={duration}
            onValueChange={handleJumpToMillis}
            value={currentPosition}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
            thumbTintColor="#000000"
          />
          <View style={{ flex: 3 }}>
            <Text style={{ fontSize: 9, marginTop: 5 }}>
              {`${Math.floor(currentPosition / 3600)
                .toString()
                .padStart(2, "0")}:${Math.floor((currentPosition % 3600) / 60)
                .toString()
                .padStart(2, "0")}:${(currentPosition % 60)
                .toString()
                .padStart(2, "0")}/${Math.floor(duration / 3600)
                .toString()
                .padStart(2, "0")}:${Math.floor((duration % 3600) / 60)
                .toString()
                .padStart(2, "0")}:${(duration % 60)
                .toString()
                .padStart(2, "0")}`}
            </Text>
          </View>
        </View>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default ReproduceAudio;
