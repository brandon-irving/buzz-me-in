"use client";
import React, { useEffect, useReducer, useState } from "react";
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
} from "@chakra-ui/react";
import Team from "../Team";
import {
  ICell,
  IHoveredCell,
  ISelectedCell,
  TriviaState,
  initialState,
  reducer,
} from "./reducer";
import { useRouter } from "next/navigation";
import { copyToClipboard } from "@/app/core/helpers";
import { familyGame, quickGame } from "@/app/core/games";

export const TriviaBoard = ({ isEdit }: { isEdit?: boolean }) => {
  const [state, dispatch] = useReducer(
    reducer,
    // quickGame
    JSON.parse(localStorage.getItem("appState") || JSON.stringify(initialState))
  );
  const {
    selectedCell,
    hoveredCell,
    columns,
    columnCategories,
    rowPoints,
    rows,
  } = state;
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
  const [teams, setTeams] = useState([
    { name: "Team 1", score: 0 },
    { name: "Team 2", score: 0 },
  ]);

  const editModal = useDisclosure();
  const jeopardyCardModal = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  function onTeamNameChange({ name, index }: { name: string; index: number }) {
    const newTeams = [...teams];
    newTeams[index].name = name;
    setTeams(newTeams);
  }

  function onTeamScoreChange({
    score,
    index,
  }: {
    score: number;
    index: number;
  }) {
    const newTeams = [...teams];
    newTeams[index].score = score + newTeams[index].score;
    setTeams(newTeams);
  }

  function toggleShowAnswer() {
    setShowAnswer(!showAnswer);
  }

  function handleTriviaClose() {
    setShowAnswer(false);
    jeopardyCardModal.onClose();
  }

  function handleAnsweredByChange({ index }: { index: number }) {
    const { rowIndex, colIndex } = selectedCell;
    const newRows = JSON.parse(JSON.stringify(rows));
    if (rowIndex !== null && colIndex !== null) {
      newRows[rowIndex][colIndex].answeredBy = teams[index].name;
    }
    setRows(newRows);
  }

  function handleGiveTeamPoints({ index }: { index: number }) {
    onTeamScoreChange({
      index,
      score:
        (selectedCell.score || 100) *
        // @ts-ignore
        (rows[selectedCell.rowIndex][selectedCell.colIndex].doublePoints
          ? 2
          : 1),
    });
    handleAnsweredByChange({ index });
    jeopardyCardModal.onClose();
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
    setSelectedCell({ rowIndex, colIndex, score: rowPoints[rowIndex] });
    if (isEdit) {
      editModal.onOpen();
    } else {
      jeopardyCardModal.onOpen();
    }
  };

  function handleRowPointsChange(e: any, index: number) {
    const newRowPoints = [...rowPoints];
    newRowPoints[index] = e.target.value;
    console.log(newRowPoints);
    setRowPoints(newRowPoints);
  }
  function handleClearForm() {
    const { rowIndex, colIndex } = selectedCell;
    const newRows = JSON.parse(JSON.stringify(rows));
    newRows[rowIndex || ""][colIndex || ""] = { question: "", answer: "" };
    setRows(newRows);
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
    console.log({ c: e.target.value.length });
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
    const options: UseToastOptions = {};
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
    localStorage.setItem("appState", JSON.stringify(state));
  }, [state]);

  return (
    <>
      <Grid
        h="100vh"
        w="100vw"
        // w="75%"
        templateColumns={`0.25fr repeat(${columns}, 1fr)`}
        gap={0}
        p={5}
        color={`primary.500`} // use the primary color for text
        bg={`primary.900`} // use the primary color for text
      >
        {/* Placeholder box for top left corner */}
        <Box>
          <ButtonGroup>
            <Button onClick={handleEndGame}>End Game</Button>
            <Button onClick={handleCopyGame}>Copy Game</Button>
          </ButtonGroup>
        </Box>
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
                  onKeyDown={(e) => {
                    console.log(e.key);
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
          <GridItem key={`row-label-${rowIndex}`} p={5}>
            <Editable
              isDisabled={!isEdit}
              color={"white"}
              defaultValue={`${rowPoints[rowIndex]}`}
            >
              <EditablePreview />
              <EditableInput
                type="number"
                onKeyDown={(e) => {
                  console.log(e.key);
                  if (e.key === "Enter") {
                    handleRowPointsChange(e, rowIndex);
                  }
                }}
                onBlur={(e) => handleRowPointsChange(e, rowIndex)}
              />
            </Editable>
          </GridItem>,
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
        <>
          {!isEdit && (
            <HStack>
              <Icon name="plus" onClick={handleAddTeam} />
            </HStack>
          )}
          {!isEdit &&
            teams.map((team, index) => {
              return (
                <HStack>
                  <Icon
                    name="minus"
                    onClick={() => handleSubtractTeam(index)}
                  />
                  <Team
                    name={team.name}
                    score={team.score}
                    onNameChange={(name) => onTeamNameChange({ index, name })}
                    onScoreChange={(score) =>
                      onTeamScoreChange({ index, score })
                    }
                    points={rowPoints[selectedCell.rowIndex || 0] || 100}
                  />
                </HStack>
              );
            })}
        </>
        {isEdit && (
          <Box>
            <button onClick={addRow}>Add Row</button>
            <button onClick={removeRow}>Remove Row</button>
            <button onClick={addColumn}>Add Column</button>
            <button onClick={removeColumn}>Remove Column</button>
          </Box>
        )}
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
              <Heading position={"absolute"} left={10}>
                Press space to show answer
              </Heading>
              <Box color="white" position={"absolute"} left={10} top={62}>
                <UnorderedList>
                  {[
                    `Press the "Team answered" button to mark the question as
                  answered`,
                    `Increment points for the team that answered correctly`,
                    `Decrement points for any team that answered incorrectly`,
                    `Press "esc" or the "x" button to close`,
                  ].map((t) => (
                    <ListItem key={t}>{t}</ListItem>
                  ))}
                </UnorderedList>
              </Box>

              <HStack w="100%" justifyContent={"flex-end"} mr={10}>
                {teams.map((team, index) => {
                  return (
                    <VStack key={`${team.name}${index}`}>
                      <Button onClick={() => handleAnsweredByChange({ index })}>
                        {team.name} answered!
                      </Button>
                      <Team
                        name={team.name}
                        score={team.score}
                        onNameChange={(name) =>
                          onTeamNameChange({ index, name })
                        }
                        onScoreChange={(score) =>
                          onTeamScoreChange({
                            index,
                            score:
                              score *
                              // @ts-ignore
                              (rows[selectedCell.rowIndex][
                                selectedCell.colIndex
                              ].doublePoints
                                ? 2
                                : 1),
                          })
                        }
                        points={rowPoints[selectedCell.rowIndex || 0] || 100}
                      />
                    </VStack>
                  );
                })}
              </HStack>
            </VStack>

            <VStack></VStack>
          </ModalHeader>

          <ModalBody>
            <Flex
              position={"absolute"}
              direction="column"
              justifyContent="center"
              alignItems="center"
              h="60%"
              w="100%"
              whiteSpace={"pre"}
            >
              {!isEdit && (
                <>
                  {selectedCell.rowIndex !== null &&
                    selectedCell.colIndex !== null && (
                      <>
                        {rows[selectedCell.rowIndex][selectedCell.colIndex]
                          .doublePoints && <Heading>DAILY DOUBLE!</Heading>}

                        <Heading fontSize={"7xl"}>
                          {showAnswer
                            ? rows[selectedCell.rowIndex][selectedCell.colIndex]
                                .answer
                            : rows[selectedCell.rowIndex][selectedCell.colIndex]
                                .question}
                        </Heading>
                        <Heading mt={10}>{selectedCell.score}</Heading>

                        <Heading>
                          {
                            rows[selectedCell.rowIndex][selectedCell.colIndex]
                              .answeredBy
                          }
                        </Heading>
                      </>
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
            {columnCategories[selectedCell.colIndex]}:
            {rowPoints[selectedCell.rowIndex]}
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
                        value={
                          rows[selectedCell.rowIndex][selectedCell.colIndex]
                            .question
                        }
                        onChange={handleQuestionChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Answer</FormLabel>
                      <Textarea
                        value={
                          rows[selectedCell.rowIndex][selectedCell.colIndex]
                            .answer
                        }
                        onChange={handleAnswerChange}
                      />
                    </FormControl>
                  </HStack>
                  <Checkbox
                    isChecked={
                      rows[selectedCell.rowIndex][selectedCell.colIndex]
                        .doublePoints
                    }
                    onChange={handleCheckChange}
                  >
                    Double Points
                  </Checkbox>
                </VStack>
              )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClearForm}>
              Clear
            </Button>
            <Button variant="ghost" mr={3} onClick={editModal.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
