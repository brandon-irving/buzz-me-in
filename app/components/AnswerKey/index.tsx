"use client";
import React from "react";
import {
    Box,
    Text,
    Grid,
    GridItem,
    Heading,
    useBreakpointValue
} from "@chakra-ui/react";
import { TriviaState } from "../TriviaBoard/reducer";

export const AnswerKey = ({ trivia }: { trivia: TriviaState }) => {
    // Adjust grid columns based on breakpoint
    const gridColumns = useBreakpointValue({ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' });

    return (
        <Box p={5}>
            <Heading mb={6} textAlign="center">Answer Key</Heading>
            <Grid templateColumns={gridColumns} gap={6}>
                {trivia.rows.map((row, i) => {
                    const points = trivia.rowPoints[i];
                    return (
                        <GridItem key={i}>
                            <Heading size="md" mb={4}>{points} Points</Heading>
                            {row.map((item, colIndex) => (
                                <Box key={colIndex} mb={4} p={2} borderRadius="md" boxShadow="sm" bg="gray.50">
                                    <Text fontWeight="bold" color="black" mb={2}>Q: {item.question}</Text>
                                    <Text color="black">A: {item.answer}</Text>
                                </Box>
                            ))}
                        </GridItem>
                    );
                })}
            </Grid>
        </Box>
    );
};
