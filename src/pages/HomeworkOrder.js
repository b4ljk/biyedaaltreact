import {
  Container,
  Heading,
  Text,
  Box,
  Spacer,
  Button,
  useToast,
  Input,
  InputGroup,
  Textarea,
  InputRightElement,
  InputLeftElement,
  Divider,
  Link,
  Flex,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/Layout";
import {
  FaTrash,
  FaLink,
  FaLock,
  FaUnlock,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  useHistory,
} from "react-router-dom";
import { db } from "../utils/init-firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import PaymentButton from "../components/PaymentButton";
import FilesUploader from "../components/Filesuploader";

export default function HomworkOrder() {
  const { currentUser } = useAuth();
  const [privateInfo, setPrivateInfo] = useState();
  const [privateLink, setPrivateLink] = useState();
  const [dansInfo, setdansInfo] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fullInfo, setFullInfo] = useState();
  const history = useHistory();
  const toast = useToast();
  const showToast = () => {
    toast({
      title: "Амжилттай",
      status: "success",
      duration: 3000,
      isClosable: true,
      variant: "left-accent",
      position: "top-right",
    });
  };
  const [additionalInfo, setAdditionalInfo] = useState();

  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  let myquery = useQuery();
  const [Payment, Setpayment] = useState(false);
  var UniqueNum = myquery.get("uniqueid");
  var incomingType = myquery.get("type");
  // if(incomingType=="Waiting"){
  //   var dataOwnerMail=additionalInfo.ownerMail;
  //   var dataProcessorMail=additionalInfo.ownerMail;
  // }else if(incomingType=="Processing"){ }

  useEffect(() => {
    if (currentUser?.email != null) {
      const q3 = query(
        doc(db, "num", incomingType, currentUser.email, `${UniqueNum}`)
      );
      const unsub3 = onSnapshot(q3, (doc) => {
        setAdditionalInfo(doc.data());
      });
      return unsub3;
    }
  }, [currentUser?.email, incomingType]);
  useEffect(() => {
    if (incomingType == "Main") {
      const q3 = query(doc(db, "num", "numedu", "Orders", `${UniqueNum}`));
      const unsub3 = onSnapshot(q3, (doc) => {
        setAdditionalInfo(doc.data());
      });
      return unsub3;
    }
  }, [currentUser?.email]);

  useEffect(() => {
    if (additionalInfo?.setU == true) {
      const q4 = query(doc(db, "num", "numedu", "Private", `${UniqueNum}`));
      const unsub4 = onSnapshot(q4, (doc) => {
        setFullInfo(doc.data());
      });
      return unsub4;
    }
  }, [additionalInfo?.setU]);
  const deleteAll = () => {
    deleteDoc(
      doc(db, "num", "Waiting", `${additionalInfo?.ownerMail}`, `${UniqueNum}`)
    );
    deleteDoc(
      doc(
        db,
        "num",
        "Processing",
        `${additionalInfo?.processingPerson}`,
        `${UniqueNum}`
      )
    );
    deleteDoc(doc(db, "num", "Processing", `foradmin`, `${UniqueNum}`));
  };
  const sendReadyData = () => {
    updateDoc(
      doc(db, "num", "Waiting", `${additionalInfo?.ownerMail}`, `${UniqueNum}`),
      {
        processingPerson: currentUser?.email,
        processingPersonProfile: currentUser?.photoURL,
      }
    );

    setDoc(
      doc(db, "num", "Processing", `${currentUser?.email}`, `${UniqueNum}`),
      {
        uniqueid: UniqueNum,
        ownerProfile: additionalInfo?.ownerProfile,
        title: additionalInfo?.title,
        price: additionalInfo?.price,
        additionalInfo: additionalInfo?.additionalInfo,
        lastestDate: additionalInfo?.lastestDate,
        class: additionalInfo?.class,
        setU: additionalInfo?.setU,
        ownerMail: additionalInfo?.ownerMail,
        timestamp: serverTimestamp(),
        isDone: false,
        processingPerson: currentUser?.email,
        processingPersonProfile: currentUser?.photoURL,
      }
    );
    setDoc(doc(db, "num", "Processing", `foradmin`, `${UniqueNum}`), {
      uniqueid: UniqueNum,
      ownerProfile: additionalInfo?.ownerProfile,
      title: additionalInfo?.title,
      price: additionalInfo?.price,
      additionalInfo: additionalInfo?.additionalInfo,
      lastestDate: additionalInfo?.lastestDate,
      class: additionalInfo?.class,
      setU: additionalInfo?.setU,
      ownerMail: additionalInfo?.ownerMail,
      timestamp: serverTimestamp(),
      isDone: false,
      processingPerson: currentUser?.email,
      processingPersonProfile: currentUser?.photoURL,
    });
    setDoc(doc(db, "num", "numedu", "Private", `${UniqueNum}`), {
      privateInfo: "123",
      privateLink: "123",
      dansInfo: "123",
    });
    deleteDoc(doc(db, "num", "numedu", "Orders", `${UniqueNum}`));
    history.push(`/homeworkorder?uniqueid=${UniqueNum}&type=Processing`);
    // onNewClassClose();
    showToast();
  };
  const writeDoneWork = () => {
    updateDoc(doc(db, "num", "numedu", "Private", `${UniqueNum}`), {
      privateInfo: privateInfo,
      privateLink: privateLink,
      dansInfo: dansInfo,
    });
    updateDoc(doc(db, "num", "Processing", "foradmin", `${UniqueNum}`), {
      privateInfo: privateInfo,
      privateLink: privateLink,
      dansInfo: dansInfo,
    });

    updateDoc(
      doc(
        db,
        "num",
        "Processing",
        additionalInfo?.processingPerson,
        `${UniqueNum}`
      ),
      {
        isDone: true,
      }
    );
    updateDoc(
      doc(db, "num", "Waiting", additionalInfo?.ownerMail, `${UniqueNum}`),
      {
        isDone: true,
      }
    );
    updateDoc(doc(db, "num", "Processing", "foradmin", `${UniqueNum}`), {
      isDone: true,
    });
    // onNewClassClose();
    showToast();
    onClose();
  };
  let buttonShow = true;
  const UserAllowed = () => {
    updateDoc(
      doc(
        db,
        "num",
        "Waiting",
        `${additionalInfo?.ownerMail}`,
        `${additionalInfo?.uniqueid}`
      ),
      {
        setU: true,
      }
    );
    updateDoc(
      doc(
        db,
        "num",
        "Processing",
        `${additionalInfo?.processingPerson}`,
        `${additionalInfo?.uniqueid}`
      ),
      {
        setU: true,
      }
    );
    updateDoc(
      doc(db, "num", "Processing", `foradmin`, `${additionalInfo?.uniqueid}`),
      {
        setU: true,
      }
    );
  };
  if (additionalInfo?.processingPerson != null) buttonShow = false;
  return (
    <Layout>
      <Container maxW="container.md" py={3}>
        <Box
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text
            fontWeight={"black"}
            fontFamily={"heading"}
            textTransform={"uppercase"}
            fontSize={"3xl"}
          >
            {additionalInfo?.title}
          </Text>
        </Box>
        <Box display={"flex"} flexDir="column">
          <Text fontWeight={"bold"}>
            Гүйцэтгэгч :{" "}
            <Text color={"pink.400"} display={"inline"}>
              {additionalInfo?.processingPerson ?? "Одоохондоо алга"}
            </Text>
          </Text>
          <Text fontWeight={"bold"}>
            Гүйцэтгэл :{" "}
            <Text color={"pink.400"} display={"inline"}>
              {additionalInfo?.processingPerson &&
                (additionalInfo?.isDone ? "Дууссан" : "Гүйцэтгэж байна.")}
            </Text>
          </Text>
          <Text fontWeight={"bold"}>
            Төлбөр: {additionalInfo?.setU ? "Төлсөн" : "Төлөөгүй"}
          </Text>
          <Text fontWeight={"bold"}>
            Эцсийн хугацаа : {additionalInfo?.lastestDate}
          </Text>
          <Text fontWeight={"bold"}>
            Хичээлийн нэр : {additionalInfo?.class}
          </Text>
          {currentUser?.email == additionalInfo?.ownerMail && (
            <Popover>
              <PopoverTrigger>
                <Button
                  display={"flex"}
                  padding={"auto"}
                  variant={"outline"}
                  _hover={{ bg: "red.500" }}
                >
                  Устгах
                  <Box ml={"2"} display={"inline"}>
                    <FaTrash size={"20"} />{" "}
                  </Box>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                  Та энэ даалгаврыг бүр мөсөн устгахдаа итгэлтэй байна уу ?
                </PopoverHeader>
                <PopoverBody>
                  <Flex alignItems={"center"}>
                    <Button
                      variant="unstyled"
                      onClick={deleteAll}
                      bg={"red.500"}
                    >
                      Тийм
                    </Button>
                    <Button variant={"unstyled"} ml={"2"}>
                      <PopoverCloseButton variant={"unstyled"}>
                        <Button mt={2} fontSize={"15"}>
                          Үгүй
                        </Button>
                      </PopoverCloseButton>
                    </Button>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
          {currentUser?.email == additionalInfo?.processingPerson && (
            <Flex flexDir={{ md: "row", base: "column" }}>
              <Popover>
                <PopoverTrigger>
                  <Button
                    display={"flex"}
                    padding={"auto"}
                    colorScheme="red"
                    variant={"outline"}
                    _hover={{ bg: "red.500" }}
                    mr="2"
                  >
                    Устгах
                    <Box ml={"2"} display={"inline"}>
                      <FaTrash size={"20"} />{" "}
                    </Box>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>
                    Та энэ даалгаврыг бүр мөсөн устгахдаа итгэлтэй байна уу ?
                  </PopoverHeader>
                  <PopoverBody>
                    <Flex>
                      <Button onClick={deleteAll} bg={"red.500"} mr="2">
                        Тийм
                      </Button>
                      <Button variant={"unstyled"} ml={"2"}>
                        <PopoverCloseButton variant={"unstyled"}>
                          <Button mt={2} fontSize={"15"}>
                            Үгүй
                          </Button>
                        </PopoverCloseButton>
                      </Button>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger>
                  <Button
                    display={"flex"}
                    padding={"auto"}
                    mr="2"
                    _hover={{ bg: "green.500" }}
                  >
                    Нууцалсан мэдээллийг харуулах
                    <Box ml={"2"} display={"inline"}>
                      <FaUnlock size={"20"} />{" "}
                    </Box>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>
                    Энэ нь буцаах боломжгүй үйлдэл бөгөөд хэрэглэгч таны
                    нууцалсан мэдээллийг харж чадна та итгэлтэй байна уу?
                  </PopoverHeader>
                  <PopoverBody>
                    <Flex>
                      <Button onClick={UserAllowed} bg={"green.500"} mr="2">
                        Тийм
                      </Button>
                      <Button>Үгүй</Button>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
          )}

          <Divider my={"3"} />
          <Text>{additionalInfo?.additionalInfo}</Text>

          <Divider bg={"green.500"} my={"3"} />
          {additionalInfo?.ownerMail == currentUser?.email && (
            <PaymentButton
              utga={additionalInfo?.ownerMail + " " + UniqueNum}
              dun={additionalInfo?.price}
            />
          )}
          {additionalInfo?.isDone && (
            <Text
              fontFamily={"heading"}
              fontSize={"2xl"}
              textTransform={"uppercase"}
              my={"2"}
              fontWeight={"black"}
              display="inline-flex"
              alignItems={"center"}
            >
              <Box mr={"2"} display={"inline"}>
                {additionalInfo?.setU && additionalInfo?.isDone ? (
                  <FaUnlock />
                ) : (
                  <FaLock />
                )}
              </Box>
              Даалгаврын{" "}
              <Text ml={"2"} color={"pink.400"}>
                хариу
              </Text>
            </Text>
          )}
          {additionalInfo?.setU && (
            <Box display={"flex"} flexDir="column">
              <Text>{fullInfo?.privateInfo}</Text>
              <Text mb="2" as={"u"} _hover={{ color: "blue" }}>
                <Link href={fullInfo?.privateLink} isExternal>
                  LINK : {fullInfo?.privateLink}
                </Link>
              </Text>

              {fullInfo?.url && (
                <Button as={"a"} href={fullInfo?.url} mb={"2"}>
                  Нэмэлт файл татах
                  <Box ml={"2"}>
                    <FaCloudDownloadAlt size={"20"} />
                  </Box>
                </Button>
              )}
            </Box>
          )}
          {/* <FaExternalLinkAlt /> */}
          {buttonShow && !(currentUser?.email == additionalInfo?.ownerMail) && (
            <Button onClick={sendReadyData}>Энэ даалгаврыг хийх</Button>
          )}
          {currentUser?.email == additionalInfo?.processingPerson && (
            <Box display={"flex"} flexDir="column">
              <Button mb={"2"} onClick={onOpen}>
                Даалгаврыг илгээх
              </Button>
              <FilesUploader
                UniqueNum={UniqueNum}
                additionalInfo={additionalInfo}
              />
            </Box>
          )}
        </Box>
      </Container>

      <Modal size={"5xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Box display={"flex"} alignItems="center">
              <FaLock size={"20"} /> <Text ml={"3"}>Хариуг илгээх</Text>
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <Box display={"flex"} justifyContent="space-between" my={"2"}>
              <FaLock />
            </Box> */}
            <InputGroup mb={"2"}>
              {/* <InputLeftElement children={<FaLock />} /> */}
              <Textarea
                isrequired="true"
                height={"20vh"}
                placeholder="Шаардлагатай зүйлсийг оруулна уу"
                onChange={(e) => {
                  setPrivateInfo(e.target.value);
                }}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement children={<FaLink />} />
              <Input
                mb={"3px"}
                variant="outline"
                placeholder="Зураг файлын линкыг оруулна уу "
                onChange={(e) => {
                  setPrivateLink(e.target.value);
                }}
              />
            </InputGroup>

            <Input
              mb={"3px"}
              variant="outline"
              placeholder="Дансны дугаар аль банк гэдгээ оруулна уу  "
              onChange={(e) => {
                setdansInfo(e.target.value);
              }}
            />

            <Text>
              Таны мөнгө даалгавраа явуулснаас 20 минутаас 2 цагын дотор таны
              дансанд байршина.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              color={"white"}
              backgroundColor={"pink.400"}
              mr={3}
              onClick={writeDoneWork}
            >
              ИЛГЭЭХ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}
