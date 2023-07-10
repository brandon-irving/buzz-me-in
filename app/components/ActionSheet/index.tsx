import {
  Button,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export const ActionSheet: FC<Props> = ({
  children,
  title,
  isOpen,
  onOpen,
  onClose,
}) => {
  return (
    <>
      <Box
        // zIndex={10000}
        // display={"flex"}
        position={"absolute"}
        right={"-5"}
        w="100%"
      >
        {!isOpen && (
          <Button
            w="50px"
            h="50px"
            borderRadius={"full"}
            colorScheme="blue"
            onClick={onOpen}
            fontSize={"2xl"}
            textAlign={"center"}
            position={"absolute"}
          >
            i
          </Button>
        )}
      </Box>
      <Drawer size="lg" placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={"primary.900"}>
          <DrawerCloseButton color={"white"} />
          {!!title && (
            <DrawerHeader borderBottomWidth="1px">{title}</DrawerHeader>
          )}
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
