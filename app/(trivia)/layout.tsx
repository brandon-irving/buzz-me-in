"use client";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { theme } from "../core/theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChakraProvider theme={theme}>
      <Box h="100vh" bg="primary.900">
        {children}
      </Box>
    </ChakraProvider>
  );
}
