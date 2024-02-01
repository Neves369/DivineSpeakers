import React, { memo, useMemo } from "react";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
const Ads: any = () => {
  return (
    <BannerAd
      unitId={"ca-app-pub-9187411594153289/1764293873"}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
};

export default memo(Ads);
