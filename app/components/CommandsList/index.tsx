import { HStack, Text, Kbd } from "@chakra-ui/react";
const commands = [
  [`Press`, `x`, `to play the "incorrect" sound`],
  [`Press`, `h`, `to show "how to play`],
  [`Press`, `s`, `to start the timer`],
  [`Press`, `p`, `to pause the timer`],
  [`Press`, `r`, `to restart the timer`],
];
export default function CommandsList() {
  return (
    <HStack position={"absolute"} bottom="5">
      {commands.map((command) => {
        return (
          <HStack border="1px solid" p={2}>
            <Text fontSize={"xl"}>{command[0]}</Text>{" "}
            <Kbd background={"black"} fontSize={"2xl"}>
              {command[1]}
            </Kbd>
            <Text fontSize={"xl"}>{command[2]}</Text>
          </HStack>
        );
      })}
    </HStack>
  );
}
