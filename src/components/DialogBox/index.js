import { Typography, Box, IconButton, TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SendIcon from "@mui/icons-material/Send";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import styles from "./taskassign.module.css";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import micImage from "../../assets/images/icons/flags/mic.png";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../layouts/authentication/FirebaseConfig";
import { getDocs, updateDoc, doc } from "firebase/firestore";

import DetailModal from "../../layouts/taskList/components/DetailModal";

const TaskAssign = ({ open, handleClose }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const [speechString, setSpeechString] = useState("");

  const [showCard, setShowCard] = useState(false);
  // const [title, setTitle] = useState(null);
  // const [description, setDescription] = useState(null);
  // const [assignee, setAssignee] = useState(null);


  const [openDetailModal, setOpenDetailModal] = useState(false);
  const handleDetailModalClose = () => setOpenDetailModal(!openDetailModal);

  const [id, setId] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [status, setStatus] = useState(null);

  const handleOpenModal = (id, title, description, assignee, status) => {
    setOpenDetailModal(true);
    setId(id);
    setTitle(title);
    setDescription(description);
    setAssignee(assignee);
    setStatus(status);
    //console.log("I am id", id, title, description, status, "<<");
  };

  const send = async () => {
    let prompt = `we have phrase I need you can extract the data
If phrase starts with create a task or may be ticket or may be todo and has title,description and assignee than return success json in this format
{
title : string,
description: string,
assignee: string,
action:"create"
} 

or if phrase starts with move and end with to any state like inprogress, testing and done then return success json in this format 
{
title :string,
state: string,
action:"move"
}
or if phrase starts with open or show details , then return success json in this format:
{
title :string,
action:"open"
}
and if phrase didn't give the title or state then return failure data as:
{
error: string
}
and if any invalid phrase then return failure data as:
{
error: string
}
phrase is "${speechString}"`;

    const genAI = new GoogleGenerativeAI("AIzaSyDOBTkZ3JrdW5hoUtuWrBLby4OGIGT3OZU");
    try {
      let model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      //console.log(text, "<<<<<<<<<");

      let json = JSON.parse(text);
      if (json.error) {
        toast.error(json.error);
      }
      console.log(json, "<<<");
      if (json.action == "move") {
        moveTask(json);
      }
      if (json.action == "create") {
        createTask(json);
      }
      if (json.action == "open") {
        openTask(json);
      }

    } catch (error) {
      console.log("Something Went Wrong");
    }
    setShowCard(true);
  };

  const speechRecognize = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const createTask = async (json) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title: json.title,
        description: json.description,
        assignee: json.assignee,
        status: "todo",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const moveTask = async (json) => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach(async (document) => {
      if (document.data().title?.toLowerCase() === json.title?.toLowerCase()) {
        const docRef = doc(db, "tasks", document.id);
        await updateDoc(docRef, {
          status: json.state,
        });
      }
    });
  };
  const openTask = async (json) => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach(async (document) => {
      console.log("open   for each ..........", document.data());
      if (document.data().title?.toLowerCase() === json.title?.toLowerCase()) {
        console.log("if ..........", document.data());
        handleOpenModal(
          document.id,
          document.data().title,
          document.data().description,
          document.data().assignee,
          document.data().status
        )
      }
    });
  };

  useEffect(() => {
    setSpeechString(transcript);
  }, [transcript]);

  return (
    <>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={styles.container}>
        <Box className={styles.headerContainer}>
          <Typography fontSize={15}>Microphone: {listening ? "on" : "off"}</Typography>
          <Box>
            <IconButton onClick={SpeechRecognition.stopListening}>
              <PauseCircleIcon />
            </IconButton>
            <IconButton onClick={resetTranscript}>
              <DeleteIcon />
            </IconButton>
            {/* <Button sx={{ cursor: "pointer", alignSelf: "end" }} onClick={createTask}>
              Create Task
            </Button> */}
          </Box>
        </Box>
        <Box className={styles.bodyContainer}>
          <TextField
            value={speechString}
            onChange={(event) => setSpeechString(event.target.value)}
            fullWidth={true}
            sx={{ "& fieldset": { border: "none" } }}
          />
          {speechString && (
            <Box className={styles.sendIcon} onClick={send}>
              <SendIcon />
            </Box>
          )}
        </Box>
        <Box className={styles.footer}>
          <Box className={styles.mic}></Box>
          <Box onClick={speechRecognize} sx={{ zIndex: 1, marginTop: "20px" }}>
            <img
              src={micImage}
              alt="mic"
              style={{ width: "36px", height: "36px", cursor: "pointer" }}
            />
          </Box>
          <Box className={styles.micshadow}></Box>
        </Box>
        {/* <Box
            sx={{
              border: "1px solid black",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              width:"100%"
            }}
          >
           <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignSelf: "center",
                width: "95%",
              }}
            >
              <Typography fontSize={15}>Microphone: {listening ? "on" : "off"}</Typography>
              <Box>
                <IconButton onClick={resetTranscript}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={SpeechRecognition.stopListening}>
                  <PauseCircleIcon />
                </IconButton>
                <IconButton onClick={speechRecognize}>
                  <MicIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: "flex", width: "90%", alignSelf: "center", color: "blue" }}>
              <Typography sx={{ mr: "5px" }}>Text:</Typography>
              <TextField
                value={speechString}
                onChange={(event) => setSpeechString(event.target.value)}
                multiline
                rows={6}
                fullWidth={true}
                sx={{ "& fieldset": { border: "none" }, margin: "-6px" }}
              />
            </Box>
            {speechString && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  width: "5%",
                  alignSelf: "end",
                  mb: "5px",
                  mr: "16px",
                  cursor: "pointer",
                }}
                onClick={send}
              >
                <SendIcon />
              </Box>
            )} 
          </Box> */}
        {/* {showCard && title && (
            <Box
              sx={{
                width: "40%",
                ml: "5%",
                background: "#e1e8e8",
                display: "flex",
                padding: "10px",
                justifyContent: "center",
                flexDirection: "column",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box
                sx={{ width: "5%", cursor: "pointer", alignSelf: "end", m: "10px" }}
                onClick={() => setShowCard(false)}
              >
                <DeleteIcon />
              </Box>
              <Typography sx={{ m: "5px" }}>
                <span style={{ textDecoration: "underline" }}>Title</span> : {title}
              </Typography>
              {description && (
                <Typography sx={{ m: "5px" }}>
                  <span style={{ textDecoration: "underline" }}>Description</span> : {description}
                </Typography>
              )}
              {assignee && (
                <Typography sx={{ m: "5px" }}>
                  <span style={{ textDecoration: "underline" }}>Assignee</span> : {assignee}
                </Typography>
              )}
              <Button sx={{ cursor: "pointer", alignSelf: "end", m: "10px" }} onClick={createTask}>
                Create Task
              </Button>
            </Box>
          )} */}
        {/* </Box> */}
      </Box>
    </Modal>
    <DetailModal open={openDetailModal} onClose={handleDetailModalClose} title={title} description={description} assignee={assignee} status={status}/>
    </>
  );
};

TaskAssign.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default TaskAssign;
