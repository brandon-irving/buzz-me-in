import { Box, ListItem, UnorderedList } from "@chakra-ui/react";
// TODO:
const editInstrunctions = [`Click on "Category" to edit the category`];
export default function HowToEdit() {
  return (
    <Box>
      <UnorderedList>
        {editInstrunctions.map((instrunction) => {
          return <ListItem key={instrunction}> {instrunction}</ListItem>;
        })}
      </UnorderedList>
    </Box>
  );
}
