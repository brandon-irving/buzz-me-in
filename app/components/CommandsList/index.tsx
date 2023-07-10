import { HStack, Text, Kbd, Box } from "@chakra-ui/react";
const commands = [
  [`Press`, `i`, `to open/close the "Info" bar`],
  [`Press`, `x`, `to play the "incorrect" sound`],
  [`Press`, `h`, `to show "how to play`],
  [`Press`, `s`, `to start the timer`],
  [`Press`, `p`, `to pause the timer`],
  [`Press`, `r`, `to restart the timer`],
  [`Press`, `esc`, `to close the question`],
];
export default function CommandsList() {
  return (
    <Box>
      {commands.map((command) => {
        return (
          <HStack w="60%" color="white" p={2}>
            <Text fontSize={"md"}>{command[0]}</Text>{" "}
            <Kbd color="primary.900" fontSize={"md"}>
              {command[1]}
            </Kbd>
            <Text fontSize={"md"}>{command[2]}</Text>
          </HStack>
        );
      })}
    </Box>
  );
}
