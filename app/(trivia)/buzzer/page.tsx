"use client";
import BuzzerButton from "@/app/components/BuzzerButton";
import { Box, VStack } from "@chakra-ui/react";

export default function Buzzer() {
  return (
    <VStack>
      <Box position={"absolute"} top="20%">
        <BuzzerButton />
      </Box>
    </VStack>
  );
}
