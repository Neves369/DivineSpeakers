import {
  Card,
  Layout,
  StyleService,
  useStyleSheet,
  Text,
} from "@ui-kitten/components";
import React, { memo } from "react";
import Ads from "../components/Ads";

const ComingSoon = () => {
  const styles = useStyleSheet(themedStyles);

  return (
    <>
      <Layout style={styles.container}>
        <Card>
          <Text>
            Infelizmente este recurso ainda não está disponível 😕
            {"\n\n"}
            Mas estamos nos esforçando ao máximo para que nas próximas
            aualizações você possa ter acesso a esse recurso. 😉
            {"\n\n\n"}
            Soli Deo gloria ✝️
          </Text>
        </Card>
      </Layout>
      <Ads />
    </>
  );
};

export default memo(ComingSoon);

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
});
