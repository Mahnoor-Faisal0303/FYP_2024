import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Typography, Box, IconButton, Input, TextField, Button } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { collection, getDocs } from "firebase/firestore"; 
import {db} from "../authentication/FirebaseConfig";

function Billing() {
  const [todos,setTodos] = useState([]);
  const [progress] = useState(["Taska", "Taskb"]);
  const [testing]= useState(["task f", "task l"]);
  const [done]= useState(["task z", "task y"]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    if (result.source.droppableId === "todo") {
      if (result.destination.droppableId === "todo") {
        const [removed] = todos.splice(result.source.index, 1);
        todos.splice(result.destination.index, 0, removed);
      }
      if (result.destination.droppableId === "inprogress") {
        const [removed] = todos.splice(result.source.index, 1);
        progress.splice(result.destination.index, 0, removed);
      }
    }

    if (result.source.droppableId === "inprogress") {
      if (result.destination.droppableId === "inprogress") {
        const [removed] = progress.splice(result.source.index, 1);
        progress.splice(result.destination.index, 0, removed);
      }
      if (result.destination.droppableId === "testing") {
        const [removed] = progress.splice(result.source.index, 1);
        testing.splice(result.destination.index, 0, removed);
      }
    }

    if (result.source.droppableId === "testing") {
      if (result.destination.droppableId === "testing") {
        const [removed] = testing.splice(result.source.index, 1);
        testing.splice(result.destination.index, 0, removed);
      }
      if (result.destination.droppableId === "done") {
        const [removed] = testing.splice(result.source.index, 1);
        done.splice(result.destination.index, 0, removed);
      }
    }

    if (result.source.droppableId === "done") {
      if (result.destination.droppableId === "done") {
        const [removed] = done.splice(result.source.index, 1);
        done.splice(result.destination.index, 0, removed);
      }
      if (result.destination.droppableId === "testing") {
        const [removed] = done.splice(result.source.index, 1);
        testing.splice(result.destination.index, 0, removed);
      }
    }
  };

  useEffect(()=>{
    const getTask = async() =>{
      const querySnapshot = await getDocs(collection(db, "tasks"));
      setTodos([]);
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`,doc.data());
        let docData = doc.data();
        todos.push(docData.title);
      })
      setTodos([...todos]);
    }
    getTask();
  },[])

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8} sx={{ marginBottom: "220px" }}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Box display={"flex"} flexDirection={"row"} sx={{ justifyContent: "space-between" }}>
            <Box width={"100%"} padding={2}>
              <Typography variant="h3" component="h2">
                Todo
              </Typography>
              <Droppable droppableId="todo">
                {(provided, snapshot) => (
                  <Box ref={provided.innerRef} minHeight={100}>
                    {todos.map((row, i) => (
                      <Draggable key={todos[i]} draggableId={todos[i]} index={i}>
                        {(provided, snapshot) => (
                          <Typography
                            padding={2}
                            variant="h6"
                            component="h2"
                            key={i}
                            sx={{ background: "#EECC8c", marginBottom: "10px" }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {todos[i]}
                          </Typography>
                        )}
                      </Draggable>
                    ))}
                  </Box>
                )}
              </Droppable>
            </Box>
            <Box width={"100%"} padding={2}>
              <Typography variant="h3" component="h2">
                In Progress
              </Typography>
              <Droppable droppableId="inprogress">
                {(provided, snapshot) => (
                  <Box ref={provided.innerRef} minHeight={100}>
                    {progress.map((row, i) => (
                      <Draggable key={progress[i]} draggableId={progress[i]} index={i}>
                        {(provided, snapshot) => (
                          <Typography
                            padding={2}
                            variant="h6"
                            component="h2"
                            key={i}
                            sx={{ background: "#E8B298", marginBottom: "10px" }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {progress[i]}
                          </Typography>
                        )}
                      </Draggable>
                    ))}
                  </Box>
                )}
              </Droppable>
            </Box>
            <Box width={"100%"} padding={2}>
              <Typography variant="h3" component="h2">
                Testing
              </Typography>

              <Droppable droppableId="testing">
                {(provided, snapshot) => (
                  <Box ref={provided.innerRef} minHeight={100}>
                    {testing.map((row, i) => (
                      <Draggable key={testing[i]} draggableId={testing[i]} index={i}>
                        {(provided, snapshot) => (
                      <Typography
                        padding={2}
                        variant="h6"
                        component="h2"
                        key={i}
                        sx={{ background: "#D3A29D", marginBottom: "10px" }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {testing[i]}
                      </Typography>
                        )}
                      </Draggable>
                    ))}
                  </Box>
                )}
              </Droppable>
            </Box>
            <Box width={"100%"} padding={2}>
              <Typography variant="h3" component="h2">
                Done
              </Typography>
              <Droppable droppableId="done">
                {(provided, snapshot) => (
                  <Box ref={provided.innerRef} minHeight={100}>
                    {done.map((row, i) => (
                      <Draggable key={done[i]} draggableId={done[i]} index={i}>
                        {(provided, snapshot) => (
                      <Typography
                        padding={2}
                        variant="h6"
                        component="h2"
                        key={i}
                        sx={{ background: "#A36361", marginBottom: "10px" }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {done[i]}
                      </Typography>
                        )}
                        </Draggable>
                    ))}
                  </Box>
                )}
              </Droppable>
            </Box>
          </Box>
        </DragDropContext>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
