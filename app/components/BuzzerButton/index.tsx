import { Button } from "@chakra-ui/react";
import useSound from "use-sound";

interface IBuzzerButton { }
export default function BuzzerButton({ }: IBuzzerButton) {
  const [play, jeopardyFx] = useSound("/sounds/jeopardy.mp3", {
    interrupt: true,
  });
  function handlePlayBuzz() {
    play();
  }
  return (
    <Button
      onClick={handlePlayBuzz}
      colorScheme="teal"
      borderRadius={"full"}
      w="xs"
      h={"xs"}
      textShadow="1px 1px darkgray"
      boxShadow="4px 4px 4px rgba(0, 0, 0, 0.2), 
                 6px 6px 6px rgba(0, 0, 0, 0.1),
                 8px 8px 8px rgba(0, 0, 0, 0.1)"
    />
  );
}
