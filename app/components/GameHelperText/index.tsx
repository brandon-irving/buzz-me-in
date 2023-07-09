import useOnKeyPress from "@/app/core/hooks/useOnKeyPress";
import {
  Box,
  Heading,
  ListItem,
  UnorderedList,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export default function GameHelperText() {
  const [showHelperText, setShowHelperText] = useState(false);
  function toggleShowHelperText() {
    setShowHelperText(!showHelperText);
  }
  useOnKeyPress({ key: "h", onPress: toggleShowHelperText });
  return (
    <VStack position={"absolute"} left={10}>
      <Heading textAlign={"left"} w="100%">
        Press space to show answer
      </Heading>
      {showHelperText && (
        <Box color="white">
          <UnorderedList>
            {[
              `Press the "Team answered" button to mark the question as
  answered`,
              `Increment points for the team that answered correctly`,
              `Decrement points for any team that answered incorrectly`,
              `Press "esc" or the "x" button to close`,
              `Hide this helper text by pressing "h"`,
            ].map((t) => (
              <ListItem key={t}>{t}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}
    </VStack>
  );
}
