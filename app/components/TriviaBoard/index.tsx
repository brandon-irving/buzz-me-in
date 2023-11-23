"use client";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  Grid,
  GridItem,
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  HStack,
  Textarea,
  FormControl,
  FormLabel,
  VStack,
  Checkbox,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  Heading,
  Icon,
  ListItem,
  UnorderedList,
  ButtonGroup,
  useToast,
  UseToastOptions,
  Divider,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import Team from "../Team";
import {
  ICell,
  IHoveredCell,
  ISelectedCell,
  initialState,
  reducer,
} from "./reducer";
import { copyToClipboard } from "@/app/core/helpers";
import { friendsGivingGame, familyGame, quickGame } from "@/app/core/games";
import GameHelperText from "../GameHelperText";
import useOnKeyPress from "@/app/core/hooks/useOnKeyPress";
import { useGameTimer } from "@/app/core/hooks/useGameTimer";
import CommandsList from "../CommandsList";
import { ActionSheet } from "../ActionSheet";
import useSound from "use-sound";
import HowToPlay from "../HowToPlay";
import HowToEdit from "../HowToEdit";
import { AddIcon, MinusIcon, PlusSquareIcon } from "@chakra-ui/icons";
import useCachedState from "@/app/core/hooks/useCachedState";

const initialTeam = [
  { name: "Team 1", score: 0 },
  { name: "Team 2", score: 0 },
]
export const TriviaBoard = ({ isEdit }: { isEdit?: boolean }) => {
  const [_, setCachedState] = useCachedState('appState', initialState)
  const [cachedTeam, setCachedTeam] = useCachedState('teamState', initialTeam)
  const [state, dispatch] = useReducer(
    reducer,
    // quickGame
    // familyGame
    // friendsGivingGame,
    // JSON.parse(localStorage.getItem("appState") || JSON.stringify(friendsGivingGame))
    JSON.parse(JSON.stringify(friendsGivingGame))

  );

  const {
    selectedCell,
    hoveredCell,
    columns,
    columnCategories,
    rowPoints,
    rows,
  } = state as {
    selectedCell: ISelectedCell;
    hoveredCell: IHoveredCell;
    columns: number;
    columnCategories: string[];
    rowPoints: number[];
    rows: ICell[][];
  };

  const setRows = (rows: Array<Array<ICell>>) =>
    dispatch({ type: "SET_ROWS", payload: rows });
  const setRowPoints = (rowPoints: Array<number>) =>
    dispatch({ type: "SET_ROW_POINTS", payload: rowPoints });
  const setColumnCategories = (columnCategories: Array<string>) =>
    dispatch({ type: "SET_COLUMN_CATEGORIES", payload: columnCategories });
  const setColumns = (columns: number) =>
    dispatch({ type: "SET_COLUMNS", payload: columns });
  const setHoveredCell = (hoveredCell: IHoveredCell) =>
    dispatch({ type: "SET_HOVERED_CELL", payload: hoveredCell });
  const setSelectedCell = (selectedCell: ISelectedCell) =>
    dispatch({ type: "SET_SELECTED_CELL", payload: selectedCell });
  const resetState = () => dispatch({ type: "RESET", payload: undefined });

  const [showAnswer, setShowAnswer] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [teams, setTeams] = useState(cachedTeam);

  const editModal = useDisclosure();
  const jeopardyCardModal = useDisclosure();
  const infoSideBar = useDisclosure();
  const toast = useToast();
  const { startTimer, timer, pauseTime, restartTimer } = useGameTimer({
    time: 15,
  });
  const [playIncorrect, incorrectFx] = useSound("/sounds/spongebob-fail.mp3", {
    interrupt: true,
  });
  const [playCorrect, correctFx] = useSound("/sounds/success.mp3", {
    interrupt: false,
  });

  useOnKeyPress({
    key: "c",
    onPress: onCPress,
    skip: !jeopardyCardModal.isOpen,
  });
  useOnKeyPress({
    key: "x",
    onPress: onXPress,
    skip: !jeopardyCardModal.isOpen,
  });
  useOnKeyPress({
    key: "s",
    onPress: handleStartTimer,
    skip: !jeopardyCardModal.isOpen,
  });
  useOnKeyPress({
    key: "p",
    onPress: pauseTime,
    skip: !jeopardyCardModal.isOpen,
  });
  useOnKeyPress({
    key: "r",
    onPress: restartTimer,
    skip: !jeopardyCardModal.isOpen,
  });
  useOnKeyPress({
    key: "i",
    onPress: handleToggleInfoBar,
    skip: editModal.isOpen || isFocused, // TODO
  });
  useOnKeyPress({
    key: "z",
    onPress: stopAllSounds,
    skip: !jeopardyCardModal.isOpen,
  });

  const currentCell =
    selectedCell.rowIndex !== null && selectedCell.colIndex !== null
      ? rows[selectedCell.rowIndex][selectedCell.colIndex]
      : null;

  const fontSize = useBreakpointValue({
    base: "2xl",
    md: "4xl",
    lg: "6xl",
  });

  function onXPress() {
    playIncorrect();
  }


  function onCPress() {
    playCorrect();
  }

  function stopAllSounds() {
    incorrectFx.stop();
    correctFx.stop();
  }

  function handleStartTimer() {
    startTimer();
    // TODO:
  }

  function handleToggleInfoBar() {
    if (infoSideBar.isOpen) {
      infoSideBar.onClose();
    } else {
      infoSideBar.onOpen();
    }
  }

  function onTeamNameChange({ name, index }: { name: string; index: number }) {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  }

  function onTeamScoreChange({
    score,
    index,
    type,
  }: {
    score: number;
    index: number;
    type: "increment" | "decrement";
  }) {
    const newTeams = [...teams];
    newTeams[index].score = score + newTeams[index].score;
    setTeams(newTeams);
    // TODO:
    if (type === "increment") {
      handleAnsweredByChange({ index });
    } else {
    }
  }

  function toggleShowAnswer() {
    setShowAnswer(!showAnswer);
  }

  function handleTriviaClose() {
    const row: ICell =
      rows[selectedCell.rowIndex as number][selectedCell.colIndex as number];
    if (!row.answeredBy && showAnswer) {
      handleAnsweredByChange({ index: null });
    }
    setShowAnswer(false);
    stopAllSounds();
    jeopardyCardModal.onClose();
  }

  function handleAnsweredByChange({ index }: { index: number | null }) {
    const { rowIndex, colIndex } = selectedCell;
    const newRows = JSON.parse(JSON.stringify(rows));
    if (rowIndex !== null && colIndex !== null) {
      newRows[rowIndex][colIndex].answeredBy =
        index === null ? "Noone" : teams[index].name;
    }
    setRows(newRows);
  }

  const addRow = () => {
    setRows([...rows, new Array(columns).fill({ question: "", answer: "" })]);
    setRowPoints([...rowPoints, 100]);
  };

  const removeRow = () => {
    setRows(rows.slice(0, -1));
    setRowPoints(rowPoints.slice(0, -1));
  };

  const addColumn = () => {
    setColumns(columns + 1);
    setRows(rows.map((row: ICell[]) => [...row, { question: "", answer: "" }]));
    setColumnCategories([...columnCategories, "Category"]);
  };

  const removeColumn = () => {
    if (columns > 1) {
      setColumns(columns - 1);
      setRows(rows.map((row: ICell[]) => row.slice(0, -1)));
      setColumnCategories(columnCategories.slice(0, -1));
    }
  };

  const onItemPress = ({
    colIndex,
    rowIndex,
  }: {
    colIndex: number;
    rowIndex: number;
  }) => {
    const cell = rows[rowIndex][colIndex] as ICell;
    setSelectedCell({ rowIndex, colIndex, score: rowPoints[rowIndex] });
    if (isEdit) {
      editModal.onOpen();
    } else {
      if (cell.doublePoints) {
        // TODO: add sound
      }
      jeopardyCardModal.onOpen();
    }
  };

  function handleRowPointsChange(e: any, index: number) {
    const newRowPoints = [...rowPoints];
    newRowPoints[index] = e.target.value;
    setRowPoints(newRowPoints);
  }

  function handleReset() {
    resetState();
    window.location.reload(); // TODO: not optimal
    // setRowPoints(initialState.rowPoints); TODO: look into
  }

  function handleCheckChange(e: any) {
    const { rowIndex, colIndex } = selectedCell;
    const newRows = JSON.parse(JSON.stringify(rows));
    if (rowIndex !== null && colIndex !== null) {
      newRows[rowIndex][colIndex].doublePoints = e.target.checked;
    }
    setRows(newRows);
  }

  function handleQuestionChange(e: any) {
    const { rowIndex, colIndex } = selectedCell;
    const newRows = JSON.parse(JSON.stringify(rows));
    if (rowIndex !== null && colIndex !== null) {
      newRows[rowIndex][colIndex].question = e.target.value;
    }
    setRows(newRows);
  }

  function handleAnswerChange(e: any) {
    const { rowIndex, colIndex } = selectedCell;
    const newRows = JSON.parse(JSON.stringify(rows));
    if (rowIndex !== null && colIndex !== null) {
      newRows[rowIndex][colIndex].answer = e.target.value;
    }
    setRows(newRows);
  }

  function handleCategoryChange(e: any, index: number) {
    const newCategories = [...columnCategories];
    newCategories[index] = !e.target.value.length ? "Category" : e.target.value;
    setColumnCategories(newCategories);
  }

  function handleAddTeam() {
    setTeams([...teams, { name: `Team ${teams.length + 1}`, score: 0 }]);
  }

  function handleSubtractTeam(index: number) {
    const newTeams = [...teams].filter((_, i) => i !== index);
    setTeams(newTeams);
  }

  function handleEndGame() {
    // router.push("/");
    delete localStorage["appState"];
    resetState();
  }

  function handleCopyGame() {
    copyToClipboard(JSON.stringify(state));
    toast({
      position: "top",
      colorScheme: "green",
      variant: "solid",
      description: "Copied to clipboard",
    });
  }

  useEffect(() => {
    if (jeopardyCardModal.isOpen) {
      const handleKeyPress = (event: any) => {
        event.preventDefault();

        if (event.code === "Space") {
          toggleShowAnswer();
        }
      };
      window.addEventListener("keydown", handleKeyPress);

      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [jeopardyCardModal.isOpen, toggleShowAnswer]);

  useEffect(() => {
    setCachedState(state)
  }, [state]);

  useEffect(() => {
    setCachedTeam(teams);
  }, [teams]);


  return (
    <>
      {isEdit && (
        <HStack w="100%" display={"flex"} justifyContent={"center"}>
          <Button isDisabled={rows.length === 5} w="200px" onClick={addRow}>
            Add Row
          </Button>
          <Button isDisabled={rows.length === 1} w="200px" onClick={removeRow}>
            Remove Row
          </Button>
          <Button isDisabled={columns === 5} w="200px" onClick={addColumn}>
            Add Column
          </Button>
          <Button isDisabled={columns === 1} w="200px" onClick={removeColumn}>
            Remove Column
          </Button>
          <Button w="200px" onClick={handleReset}>
            Reset
          </Button>
          <Button w="200px" onClick={handleCopyGame}>
            Copy JSON
          </Button>
        </HStack>
      )}
      <Grid
        h="100vh"
        w="100vw"
        templateColumns={
          isEdit ? `0.25fr repeat(${columns}, 1fr)` : `repeat(${columns}, 1fr)`
        }
        gap={0}
        p={5}
        color={`primary.500`} // use the primary color for text
        bg={`primary.900`} // use the primary color for text
      >
        {/* Placeholder box for top left corner */}
        {isEdit && (
          <Box>
            {/* 
            // TODO
            <ButtonGroup>
              <Button onClick={handleEndGame}>End Game</Button>
              <Button onClick={handleCopyGame}>Copy Game</Button>
            </ButtonGroup> */}
          </Box>
        )}
        {columnCategories.map((category: string, colIndex: number) => (
          <GridItem key={`column-label-${colIndex}`} p={5}>
            <Flex justifyContent="center" alignItems="center" h="100%">
              <Editable
                isDisabled={!isEdit}
                color={"white"}
                defaultValue={category}
              >
                <EditablePreview />
                <EditableInput
                  onFocus={() => {
                    setIsFocused(true);
                  }}
                  onBlurCapture={() => {
                    setIsFocused(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCategoryChange(e, colIndex);
                    }
                  }}
                  onBlur={(e) => handleCategoryChange(e, colIndex)}
                />
              </Editable>
            </Flex>
          </GridItem>
        ))}
        {rows.map((row: ICell[], rowIndex: number) => [
          isEdit && (
            <GridItem
              id={`points-gridItem-${rowIndex}`}
              key={`row-label-${rowIndex}`}
              p={5}
            >
              <Editable
                id={`points-editable-${rowIndex}`}
                isDisabled={!isEdit}
                color={"white"}
                defaultValue={`${rowPoints[rowIndex]}`}
              >
                <EditablePreview />
                <EditableInput
                  onFocus={() => {
                    setIsFocused(true);
                  }}
                  onBlurCapture={() => {
                    setIsFocused(false);
                  }}
                  type="number"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRowPointsChange(e, rowIndex);
                    }
                  }}
                  onBlur={(e) => handleRowPointsChange(e, rowIndex)}
                />
              </Editable>
            </GridItem>
          ),
          ...row.map((cell: ICell, colIndex: number) => {
            const isAnswered = !!cell.answeredBy;
            return (
              <GridItem
                onClick={() => onItemPress({ colIndex, rowIndex })}
                onMouseEnter={() =>
                  setHoveredCell({ row: rowIndex, col: colIndex })
                }
                onMouseLeave={() => setHoveredCell({ row: null, col: null })}
                p={5}
                color={"white"} // use the primary color for text
                bg={
                  isAnswered
                    ? "secondary.500"
                    : hoveredCell.row === rowIndex &&
                      hoveredCell.col === colIndex
                      ? "secondary.500" // hovered cell color
                      : "primary.700" // non-hovered cell color
                }
                border={`1px solid black`} // border color
                key={`${rowIndex}-${colIndex}`}
              >
                <Flex justifyContent="center" alignItems="center" h="100%">
                  <Text
                    textAlign={"center"}
                    isTruncated
                    maxW="200px"
                    maxH="50px"
                    whiteSpace="normal"
                    overflowY="hidden"
                    textOverflow="ellipsis"
                    style={{ whiteSpace: "pre" }}
                  >
                    {isAnswered
                      ? `${cell.answeredBy}\n${cell.answer}`
                      : isEdit
                        ? cell.question || rowPoints[rowIndex]
                        : rowPoints[rowIndex]}
                  </Text>
                </Flex>
              </GridItem>
            );
          }),
        ])}
        {!isEdit && (
          <IconButton
            w="40px"
            aria-label="plus"
            colorScheme='blue'
            onClick={handleAddTeam}
            icon={<AddIcon />}
            isDisabled={teams.length === 5}
          />
        )}

        {!isEdit && (
          <HStack position={"absolute"} left={'5%'} w="100%" bottom="0">
            {teams.map((team, index) => {
              return (
                <VStack key={`${team.name}${index}`} position={'relative'}>
                  <Team
                    name={team.name}
                    score={team.score}
                    onTeamAnswered={() => {
                      handleAnsweredByChange({ index });
                    }}
                    onNameChange={(name) => onTeamNameChange({ index, name })}
                    onScoreChange={(score, type) =>
                      onTeamScoreChange({
                        type,
                        index,
                        score:
                          score *
                          // @ts-ignore
                          (rows[selectedCell.rowIndex][selectedCell.colIndex]
                            .doublePoints
                            ? 2
                            : 1),
                      })
                    }
                    points={rowPoints[selectedCell.rowIndex || 0] || 100}
                  />
                  <IconButton
                    aria-label="minus"
                    colorScheme='red'
                    position={'absolute'}
                    right={0}
                    onClick={() => handleSubtractTeam(index)}
                    icon={<MinusIcon boxSize={2} />}
                    isDisabled={teams.length === 2}
                  />
                </VStack>
              );
            })}
          </HStack>
        )}

        <ActionSheet {...infoSideBar}>
          <Box color="white" mt={10}>
            <Heading>Commands</Heading>
            <CommandsList />
          </Box>
          <Divider py={2} />
          <Box color="white" mt={10}>
            <Heading>How to play</Heading>
            <HowToPlay />
          </Box>
          <Divider py={2} />

          <Box color="white" mt={10}>
            <Heading>How to Edit</Heading>
            <HowToEdit />
          </Box>
        </ActionSheet>
      </Grid>
      <Modal
        id="jeopardy card modal"
        isOpen={jeopardyCardModal.isOpen}
        onClose={handleTriviaClose}
        size="full"
      >
        <ModalOverlay />
        <ModalContent bg="primary.900" color={"white"}>
          <ModalHeader>
            <ModalCloseButton autoFocus={false} />
            <VStack>
              <GameHelperText />
            </VStack>
          </ModalHeader>

          <ModalBody id="main-title-modal-body">
            <Flex
              id="main-title-flex"
              direction="column"
              justify="center"
              align="center"
              height="100vh"
            >
              {!isEdit && (
                <>
                  {selectedCell.rowIndex !== null &&
                    selectedCell.colIndex !== null && (
                      <VStack>
                        {currentCell?.doublePoints && (
                          <Heading>DAILY DOUBLE!</Heading>
                        )}
                        <Box id="main-title-box">
                          <Heading
                            id="main-title"
                            textAlign={"center"}
                            fontSize={fontSize}
                          >
                            {showAnswer
                              ? rows[selectedCell.rowIndex][
                                selectedCell.colIndex
                              ].answer
                              : rows[selectedCell.rowIndex][
                                selectedCell.colIndex
                              ].question}
                          </Heading>
                        </Box>
                        <VStack position={"absolute"} top={20}>
                          <Heading>Timer</Heading>
                          <Heading>{timer}</Heading>
                        </VStack>
                        <Heading>{currentCell?.answeredBy}</Heading>
                      </VStack>
                    )}
                </>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        id="edit modal"
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {columnCategories[selectedCell.colIndex as number]}:
            {rowPoints[selectedCell.rowIndex as number]}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCell.rowIndex !== null &&
              selectedCell.colIndex !== null && (
                <VStack>
                  <HStack>
                    <FormControl>
                      <FormLabel>Question</FormLabel>
                      <Textarea
                        value={currentCell?.question}
                        onChange={handleQuestionChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Answer</FormLabel>
                      <Textarea
                        value={currentCell?.answer}
                        onChange={handleAnswerChange}
                      />
                    </FormControl>
                  </HStack>
                  <Checkbox
                    isChecked={currentCell?.doublePoints}
                    onChange={handleCheckChange}
                  >
                    Double Points
                  </Checkbox>
                </VStack>
              )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={editModal.onClose}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
