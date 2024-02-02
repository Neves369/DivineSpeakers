//@ts-nocheck
import React, { useState, useCallback, useRef, memo } from "react";
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@ui-kitten/components";
const { width, height } = Dimensions.get("window");
import Carousel, { Pagination } from "react-native-snap-carousel";
import useColorScheme from "../hooks/useColorScheme";

interface ItemProps {
  title: string;
  text: string;
}

interface RenderItemProps {
  item: ItemProps;
  index: number;
}

const CustomCarousel: any = (param: Array<any>) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const ref = useRef(null);

  const renderItem = useCallback(({ item, index }: RenderItemProps) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          //@ts-ignore
          param.navigation.navigate("Arquivos", item);
        }}
        style={styles.item}
        disabled={item.status == true ? true : false}
      >
        {
          <ImageBackground
            resizeMode="stretch"
            style={styles.image}
            imageStyle={{ borderRadius: 15 }}
            source={{
              uri: `${item.foto}`,
              cache: "only-if-cached",
            }}
          >
            <Text category="h1" status="control">
              {item.nome}
            </Text>
            <Text category="h6" status="control" style={{ color: "#e9e9e9" }}>
              {item.titulo}
            </Text>
          </ImageBackground>
        }
      </TouchableOpacity>
    );
  }, []);

  if (param.data) {
    return (
      <View style={{ flex: 1 }}>
        <Carousel
          loop
          autoplay
          ref={ref}
          layout={"tinder"}
          data={param.data}
          itemWidth={width}
          sliderWidth={width}
          itemHeight={height}
          initialNumToRender={1}
          renderItem={renderItem}
          autoplayInterval={10000}
          containerCustomStyle={styles.carousel}
          onSnapToItem={(index: number) => setActiveIndex(index)}
        />

        <Pagination
          dotsLength={param.data.length}
          activeDotIndex={activeIndex}
          carouselRef={ref}
          containerStyle={styles.paginationContainer}
          dotStyle={[
            styles.dotStyle,
            {
              backgroundColor: useColorScheme() == "light" ? "black" : "white",
            },
          ]}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          tappableDots={true}
        />
      </View>
    );
  }
};

export default memo(CustomCarousel);

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
  },
  image: {
    flex: 1,
    padding: 16,
    borderRadius: 50,
    justifyContent: "flex-end",
  },

  item: {
    alignSelf: "center",
    marginVertical: "5%",
    height: 300,
    width: 350,
    borderRadius: 50,
  },
  shadowBox: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paginationContainer: {
    alignItems: "center",
    width: "100%",
    bottom: "0%",
    position: "absolute",
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
  },
});
