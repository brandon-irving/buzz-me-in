import { Box, Text } from "@chakra-ui/react";
// TODO:
export default function HowToPlay() {
  return (
    <Box>
      <Text>
        The host selects a player to start the game. The player chooses a
        category and point value (e.g., "Movies for 200"). The host reads the
        clue aloud. Players use a buzzer or raise their hand to signal they want
        to answer. The first player to signal gets the opportunity to respond.
        They must phrase their response in the form of a question. For example,
        if the clue is "This actor played Iron Man in the Marvel Cinematic
        Universe," the correct response would be "Who is Robert Downey Jr.?" If
        the player's response is correct, they earn the points associated with
        the clue. The host updates the player's score. If the player's response
        is incorrect, they lose the points associated with the clue, and the
        host allows other players to answer. The player who answered correctly
        in the previous round gets to choose the next clue. Repeat steps 2-8
        until all clues have been answered or the designated time limit expires.
      </Text>
    </Box>
  );
}
