import { Typography, Box, IconButton, Input, TextField,Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import DeleteIcon from "@mui/icons-material/Delete";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SendIcon from "@mui/icons-material/Send";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import styles from "./taskassign.module.css";
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../layouts/authentication/FirebaseConfig";

const TaskAssign = ({open , handleClose}) =>{
  const { transcript, listening, resetTranscript } =
    useSpeechRecognition();
    
  const [speechString, setSpeechString] = useState("");

  const [showCard, setShowCard] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [assignee, setAssignee] = useState(null);

  const send = async () => {
    let prompt = `we have phrase I need you can extract the data
If phrase has create a task or may be ticket or may be todo return success json in this format
{
title : string,
description: string,
assignee: string,
}
and if phrase didn't give the title then return failure data as:
{
error: string
}
phrase is "${speechString}"`

    const genAI = new GoogleGenerativeAI("AIzaSyDOBTkZ3JrdW5hoUtuWrBLby4OGIGT3OZU");
    try {
      let model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(text,"<<<<<<<<<");
      
      let json = JSON.parse(text);
      if (json.error){
         toast.error(json.error)
      }

      setTitle(json.title);      
      setDescription(json.description);
      setAssignee(json.assignee);
    } catch (error) {
      console.log("Something Went Wrong");
    }
    setShowCard(true);
  };

  const speechRecognize = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const createTask = async() =>{
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title: title,
        description: description,
        assignee: assignee,
        status: "todo"
      });
      console.log("Document written with ID: ", docRef.id);
    } 
    catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(() => {
    setSpeechString(transcript);
  }, [transcript]);

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
    <Box className={styles.container}>
      <Button onClick={handleClose} sx={{ml:"820px"}}>close</Button>
      <Typography variant="h3" sx={{ ml: "2%" }}>
        Please Assign A Task Here!
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box
          sx={{
            border: "1px solid black",
            borderRadius: "10px",
            display: "flex",
            //justifyContent: "center",
            width: "50%",
            flexDirection: "column",
            mt: "10px",
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
              sx={{"& fieldset": { border: 'none' },margin:"-6px"}}
            />
          </Box>
          {speechString  && (
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
        </Box>
        {showCard && title &&(
          <Box
            sx={{
              width: "40%",
              ml: "5%",
              background: "#e1e8e8",
              display: "flex",
              padding:"10px",
              justifyContent: "center",
              flexDirection: "column",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
            }}
          >
            <Box
              sx={{ width: "5%", cursor: "pointer", alignSelf: "end", m: "10px" }}
              onClick={() => setShowCard(false)}
            >
              <DeleteIcon />
            </Box>
            <Typography sx={{ m: "5px" }}>
              <span style={{ textDecoration: "underline" }}>Title</span>{" "}:{" "}{title}
            </Typography>
            {description &&
            <Typography sx={{ m: "5px" }}>
              <span style={{ textDecoration: "underline" }}>Description</span>{" "}:{" "}{description}
            </Typography>
            }
            {assignee && 
            <Typography sx={{ m: "5px" }}>
              <span style={{ textDecoration: "underline" }}>Assignee</span>{" "}:{" "}{assignee}
            </Typography>
            }
            <Button
              sx={{ cursor: "pointer", alignSelf: "end", m: "10px"}}
              onClick={createTask}
            >
              Create Task
            </Button>
          </Box>
        )}
      </Box>
      </Box>
      </Modal>
  );
};

TaskAssign.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default TaskAssign;
