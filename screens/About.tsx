import {
  Card,
  Layout,
  StyleService,
  useStyleSheet,
  Text,
} from "@ui-kitten/components";
import data from "../data.json";
import React, { memo } from "react";

const About = () => {
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout style={styles.container}>
      <Card>
        <Text>
          Divine Speakers é uma biblioteca que visa distribur conteúdos de
          pregadores históricos e atuais centrados no evangelho, bem como
          confissões de fé, credos, catecismos, entre outros documentos. O
          objetivo é edificar sua vida e dessa forma glorificar a Jesus Cristo,
          lembrando-nos da história da igreja e trazendo visibilidade a uma
          teologia saudável e pura.
          {"\n\n\n"}
        </Text>
        <Text>
          Aqui você encontrará:
          {"\n\n"}- Uma vasta de lista de pregadores, teólogos, mestres e
          doutores centrados na palavra.
          {"\n\n"}- Documentos, livros e áudios edificantes.
          {"\n\n"}- Testemunhos ricos da graça de Deus.
          {"\n\n"}- Credos, Confissões e Catecismos.
        </Text>
      </Card>
    </Layout>
  );
};

export default memo(About);

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
});
