import { Button } from "@chakra-ui/react";

interface IBuzzerButton {}
export default function BuzzerButton({}: IBuzzerButton) {
  function handlePlayBuzz() {}
  return (
    <Button
      onClick={handlePlayBuzz}
      colorScheme="teal"
      borderRadius={"full"}
      w="md"
      h={"md"}
      textShadow="1px 1px darkgray"
      boxShadow="4px 4px 4px rgba(0, 0, 0, 0.2), 
                 6px 6px 6px rgba(0, 0, 0, 0.1),
                 8px 8px 8px rgba(0, 0, 0, 0.1)"
    />
  );
}
