import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    primary: {
      50: "#F2F2F2",
      100: "#DBDBDB",
      200: "#C4C4C4",
      300: "#ADADAD",
      400: "#969696",
      500: "#7F7F7F",
      600: "#676767",
      700: "#4F4F4F",
      800: "#383838",
      900: "#202020",
    },
    accent: {
      50: "#FFE5E5",
      100: "#FFBFBF",
      200: "#FF9999",
      300: "#FF7373",
      400: "#FF4D4D",
      500: "#FF2727",
      600: "#CC1F1F",
      700: "#991818",
      800: "#661010",
      900: "#330808",
    },
    secondary: {
      50: "#E6F2FF",
      100: "#BFDFFF",
      200: "#99CCFF",
      300: "#73B8FF",
      400: "#4DA4FF",
      500: "#278FFF",
      600: "#2070CC",
      700: "#185199",
      800: "#103366",
      900: "#081A33",
    },
  },
  fonts: {
    heading: "Arial",
    body: "Arial",
  },
});
