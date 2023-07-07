"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../core/theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
