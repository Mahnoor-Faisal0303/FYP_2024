import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Typography, Box, IconButton, Input, TextField } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import DeleteIcon from "@mui/icons-material/Delete";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SendIcon from "@mui/icons-material/Send";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

function TaskAssign() {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const [speechString, setSpeechString] = useState("");

  const [showCard, setShowCard] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [assignee, setAssignee] = useState(null);

  const send = async () => {
    let prompt = `phrase = "${speechString}"
if phrase doesn't want to create ticket or task or todo.
return Json error.
and in the phrase it should tell us what title is what description is and which one it should be assigned to the task 
otherwise return error.
output in json format and it has these keys title, description, assignee.
if there is any field empty return null instead of empty string.`;

    const genAI = new GoogleGenerativeAI("AIzaSyDOBTkZ3JrdW5hoUtuWrBLby4OGIGT3OZU");
    try {
      let model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      let json = JSON.parse(text);

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

  useEffect(() => {
    setSpeechString(transcript);
  }, [transcript]);

  return (
    <DashboardLayout>
      <Box>
        <DashboardNavbar />
      </Box>
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
            {/* <Typography>{transcript}</Typography> */}
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
        {showCard && (
          <Box
            sx={{
              width: "40%",
              ml: "5%",
              background: "pink",
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{ width: "5%", cursor: "pointer", alignSelf: "end", m: "10px" }}
              onClick={() => setShowCard(false)}
            >
              <DeleteIcon />
            </Box>
            <Typography sx={{ color: "green", m: "5px" }}>
              <span style={{ textDecoration: "underline" }}>Title</span>:{title}
            </Typography>
            <Typography sx={{ color: "green", m: "5px" }}>
              <span style={{ textDecoration: "underline" }}>Description</span>:{description}
            </Typography>
            <Typography sx={{ color: "green", m: "5px" }}>
              <span style={{ textDecoration: "underline" }}>Assignee</span>:{assignee}
            </Typography>
            <Box
              sx={{ width: "5%", cursor: "pointer", alignSelf: "end", m: "10px" }}
              onClick={() => setShowCard(true)}
            >
              <SendIcon />
            </Box>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default TaskAssign;
