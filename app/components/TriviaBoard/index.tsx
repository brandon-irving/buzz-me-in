"use client";
import React, { useState } from "react";
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
} from "@chakra-ui/react";

interface ICell {
  question: string;
  answer: string;
  doublePoints?: boolean;
}

interface IHoveredCell {
  row: number | null;
  col: number | null;
}
interface ISelectedCell {
  rowIndex: number | null;
  colIndex: number | null;
}

export const TriviaBoard = () => {
  const isEdit = true;
  const [rows, setRows] = useState<Array<Array<ICell>>>(
    new Array(5).fill(new Array(5).fill({ question: "", answer: "" }))
  );
  const [rowPoints, setRowPoints] = useState<Array<number>>(
    new Array(5).fill(100)
  );
  const [columnCategories, setColumnCategories] = useState<Array<string>>(
    new Array(5).fill("Category")
  );
  const [columns, setColumns] = useState<number>(5);
  const [hoveredCell, setHoveredCell] = useState<IHoveredCell>({
    row: null,
    col: null,
  });
  const [selectedCell, setSelectedCell] = useState<ISelectedCell>({
    rowIndex: null,
    colIndex: null,
  });
  const editModal = useDisclosure();
  const jeopardyCardModal = useDisclosure();

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
    setRows(rows.map((row) => [...row, { question: "", answer: "" }]));
    setColumnCategories([...columnCategories, ""]);
  };

  const removeColumn = () => {
    if (columns > 1) {
      setColumns(columns - 1);
      setRows(rows.map((row) => row.slice(0, -1)));
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
    setSelectedCell({ rowIndex, colIndex });
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
    newRows[rowIndex || ""][colIndex || ""].doublePoints = e.target.checked;
    setRows(newRows);
  }
  function handleQuestionChange(e: any) {
    const { rowIndex, colIndex } = selectedCell;
    const newRows = JSON.parse(JSON.stringify(rows));
    newRows[rowIndex || ""][colIndex || ""].question = e.target.value;
    setRows(newRows);
  }

  function handleAnswerChange(e: any) {
    const { rowIndex, colIndex } = selectedCell;
    const newRows = JSON.parse(JSON.stringify(rows));
    newRows[rowIndex || ""][colIndex || ""].answer = e.target.value;
    setRows(newRows);
  }

  function handleCategoryChange(e: any, index: number) {
    const newCategories = [...columnCategories];
    newCategories[index] = e.target.value;
    setColumnCategories(newCategories);
  }
  return (
    <Grid
      h="100vh"
      w="75%"
      templateColumns={`0.25fr repeat(${columns}, 1fr)`}
      gap={0}
      p={5}
    >
      <Box /> {/* Placeholder box for top left corner */}
      {columnCategories.map((category, colIndex) => (
        <GridItem key={`column-label-${colIndex}`} p={5}>
          <Flex justifyContent="center" alignItems="center" h="100%">
            <Editable defaultValue={category}>
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
      {rows.map((row, rowIndex) => [
        <GridItem key={`row-label-${rowIndex}`} p={5}>
          <Editable defaultValue={`${rowPoints[rowIndex]}`}>
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
        ...row.map((cell, colIndex) => (
          <GridItem
            onClick={() => onItemPress({ colIndex, rowIndex })}
            onMouseEnter={() =>
              setHoveredCell({ row: rowIndex, col: colIndex })
            }
            onMouseLeave={() => setHoveredCell({ row: null, col: null })}
            p={5}
            color="white"
            bg={
              hoveredCell.row === rowIndex && hoveredCell.col === colIndex
                ? "brand.500"
                : "brand.900"
            }
            border={"1px solid black"}
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
              >
                {cell.question || rowPoints[rowIndex]}
              </Text>
            </Flex>
          </GridItem>
        )),
      ])}
      <Box>
        <button onClick={addRow}>Add Row</button>
        <button onClick={removeRow}>Remove Row</button>
        <button onClick={addColumn}>Add Column</button>
        <button onClick={removeColumn}>Remove Column</button>
      </Box>
      <Modal
        id="jeopardy card modal"
        isOpen={jeopardyCardModal.isOpen}
        onClose={jeopardyCardModal.onClose}
        size="full"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Question and Answer</ModalHeader>
          <ModalBody>
            {selectedCell.rowIndex !== null &&
              selectedCell.colIndex !== null && (
                <>
                  <h3>
                    Question:{" "}
                    {
                      rows[selectedCell.rowIndex][selectedCell.colIndex]
                        .question
                    }
                  </h3>
                  <p>
                    Answer:{" "}
                    {rows[selectedCell.rowIndex][selectedCell.colIndex].answer}
                  </p>
                </>
              )}
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
          <ModalHeader>Edit Question, Answer</ModalHeader>
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
    </Grid>
  );
};
