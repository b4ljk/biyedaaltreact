import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Button,
  Link,
  useDisclosure,
  Text,
  color,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";
import { useState, useEffect } from "react";
import { db } from "../utils/init-firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { FaTrash, FaCheck, FaDollarSign } from "react-icons/fa";
import { Link as ReachLink } from "react-router-dom";

export default function AdminPanel() {
  var textlink, texttext;
  var bataa = "sda";

  const {
    isOpen: isLinkOpen,
    onOpen: onLinkOpen,
    onClose: onLinkClose,
  } = useDisclosure();
  const [processingData, setprocessingData] = useState();
  const [privateInfo1, setPrivateInfo1] = useState();
  const [privateLink1, setPrivateLink1] = useState();
  useEffect(() => {
    const q = query(collection(db, "num", "Processing", "foradmin"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let tmpArray = [];
      querySnapshot.forEach((doc) => {
        tmpArray.push({ ...doc.data(), id: doc.id });
      });
      setprocessingData(tmpArray);
    });
    return unsub;
  }, []);
  const Paid = (props) => {
    console.log(props.ownerMail);
    console.log(props.uniqueid);
    updateDoc(
      doc(db, "num", "Waiting", `${props?.ownerMail}`, `${props?.uniqueid}`),
      {
        setU: true,
      }
    );
    updateDoc(
      doc(
        db,
        "num",
        "Processing",
        `${props?.processingPerson}`,
        `${props?.uniqueid}`
      ),
      {
        setU: true,
      }
    );
    updateDoc(doc(db, "num", "Processing", `foradmin`, `${props?.uniqueid}`), {
      setU: true,
    });
  };

  const tabledata = processingData?.map((value) => {
    var colorfordone;
    if (value.setU === true) {
      colorfordone = "green";
    }
    return (
      <Tr color={colorfordone ?? ""}>
        <Modal size={"full"} isOpen={isLinkOpen} onClose={onLinkClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Мэдээлэл</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{privateInfo1}</Text>
              <Button>
                <Link href={privateLink1} isExternal>
                  {privateLink1}
                </Link>
              </Button>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onLinkClose}>
                Хаах
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Td>{value.ownerMail}</Td>
        <Td>{value.processingPerson}</Td>
        <Td>{value.price}</Td>
        <Td>{`${value.isDone}`}</Td>
        <Td>{`${value.setU}`}</Td>
        <Td>
          <Button
            onClick={() => {
              onLinkOpen();
              setPrivateInfo1(value.privateInfo);
              setPrivateLink1(value.privateLink);
            }}
          >{`${value.privateInfo?.slice(0, 15)}`}</Button>
        </Td>
        <Td>
          <Button
            onClick={() => {
              onLinkOpen();
              setPrivateInfo1(value.privateInfo);
              setPrivateLink1(value.privateLink);
            }}
          >{`${value.privateLink?.slice(0, 15)}`}</Button>
        </Td>
        <Box display={"flex"} flexDir="column">
          <Button
            mb={"1"}
            onClick={() => {
              Paid(value);
            }}
            borderWidth={"3px"}
            borderColor="green.500"
            rounded={"none"}
            color={"green.500"}
          >
            <FaCheck />
          </Button>
          <Button
            borderWidth={"3px"}
            borderColor={"red.500"}
            rounded={"none"}
            color={"red.500"}
          >
            <FaTrash />
          </Button>
        </Box>
      </Tr>
    );
  });
  return (
    <Box>
      <Navbar />
      <TableContainer>
        <Table variant="striped" size={"lg"}>
          <TableCaption>Admin panel</TableCaption>
          <Thead>
            <Tr>
              <Th>Эзэмшигч</Th>
              <Th>Хэрэгжүүлэгч</Th>
              <Th>ҮНэ</Th>
              <Th>хэрэгжүүлэлт</Th>
              <Th>Төлбөр</Th>
              <Th>private</Th>
              <Th>link</Th>
            </Tr>
          </Thead>
          <Tbody>{tabledata}</Tbody>
          <Tfoot>
            <Tr></Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
}
