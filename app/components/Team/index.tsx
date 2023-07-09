import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";

export type Props = {
  name: string;
  score: number;
  points: number;
  onScoreChange: (score: number, type: "increment" | "decrement") => void;
  onNameChange: (name: string) => void;
  onTeamAnswered?: (name: string) => void;
  hideButtons?: boolean;
};

export default function Team({
  name,
  score,
  onScoreChange,
  onNameChange,
  points,
  onTeamAnswered,
}: Props) {
  function handleNameChange(e: any) {
    onNameChange(e.target.value);
  }
  const incrementScore = () => {
    onScoreChange(points, "increment");
  };
  const decrementScore = () => {
    onScoreChange(points * -1, "decrement");
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={2}>
      <HStack justify={"center"}>
        <Editable
          textAlign={"center"}
          fontSize={"xl"}
          // isDisabled={!isEdit}
          color={"white"}
          defaultValue={name}
        >
          <EditablePreview />
          <EditableInput
            onKeyDown={(e) => {
              console.log("log: key pressed", e.key);
              if (e.key === "Enter") {
                handleNameChange(e);
              }
            }}
            onBlur={handleNameChange}
          />
        </Editable>
        {!!onTeamAnswered && (
          <Button onClick={() => onTeamAnswered(name)}>answered!</Button>
        )}
      </HStack>
      <VStack>
        <Text fontSize="xl">{`Score: ${score}`}</Text>
        <HStack spacing={4}>
          <Button onClick={incrementScore} colorScheme="green">
            Increment
          </Button>
          <Button onClick={decrementScore} colorScheme="red">
            Decrement
          </Button>
        </HStack>
      </VStack>
    </Box>
    // <Box>
    //   <VStack>
    //     <Heading>{name}</Heading>
    // <Editable
    //   // isDisabled={!isEdit}
    //   color={"white"}
    //   defaultValue={name}
    // >
    //   <EditablePreview />
    //   <EditableInput
    //     onKeyDown={(e) => {
    //       console.log(e.key);
    //       if (e.key === "Enter") {
    //         handleNameChange(e);
    //       }
    //     }}
    //     onBlur={handleNameChange}
    //   />
    // </Editable>
    //   </VStack>
    // </Box>
  );
}
