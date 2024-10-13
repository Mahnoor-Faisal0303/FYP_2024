import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Typography, Box, Button } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DetailModal from "./components/DetailModal";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../authentication/FirebaseConfig";
import { onSnapshot } from "firebase/firestore";

function TaskList() {
  const [todos, setTodos] = useState([]);
  const [progress, setProgress] = useState([]);
  const [testing, setTesting] = useState([]);
  const [done, setDone] = useState([]);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(!open);

  const [id, setId] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [status, setStatus] = useState(null);

  const handleOpenModal = (id, title, description, assignee, status) => {
    setOpen(true);
    setId(id);
    setTitle(title);
    setDescription(description);
    setAssignee(assignee);
    setStatus(status);
    console.log("I am id", id, title, description, status, "<<");
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    if (result.source.droppableId === "todo") {
      if (result.destination.droppableId === "todo") {
        const [removed] = todos.splice(result.source.index, 1);
        todos.splice(result.destination.index, 0, removed);
      }
      if (result.destination.droppableId === "inprogress") {
        const [removed] = todos.splice(result.source.index, 1);
        progress.splice(result.destination.index, 0, removed);

        const docRef = doc(db, "tasks", removed.id);

        await updateDoc(docRef, {
          status: "inprogress",
        });
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

        const docRef = doc(db, "tasks", removed.id);

        await updateDoc(docRef, {
          status: "testing",
        });
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

        const docRef = doc(db, "tasks", removed.id);

        await updateDoc(docRef, {
          status: "done",
        });
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

        const docRef = doc(db, "tasks", removed.id);

        await updateDoc(docRef, {
          status: "testing",
        });
      }
    }
  };

  useEffect(() => {
    const getTask = () => {
      onSnapshot(collection(db, "tasks"), (querySnapshot) => {
        todos.splice(0, todos.length);
        progress.splice(0, progress.length);
        testing.splice(0, testing.length);
        done.splice(0, done.length);
        setTodos([]);
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`, doc.data());
          let docData = doc.data();
          docData.id = doc.id;
          if (docData.status === "todo") {
            todos.push(docData);
          }
          if (docData.status === "inprogress") {
            progress.push(docData);
          }
          if (docData.status === "testing") {
            testing.push(docData);
          }
          if (docData.status === "done") {
            done.push(docData);
          }
        });
        setTodos([...todos]);
        setProgress([...progress]);
        setTesting([...testing]);
        setDone([...done]);
      });
    };
    getTask();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8} sx={{ marginBottom: "220px" }}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Box display={"flex"} flexDirection={"row"} sx={{ justifyContent: "space-between" }}>
            <Box width={"100%"} padding={2}>
              <Typography variant="h3" component="h2">
                TODO
              </Typography>
              <Droppable droppableId="todo">
                {(provided, snapshot) => (
                  <Box ref={provided.innerRef} minHeight={100}>
                    {todos.map((row, i) => (
                      <Draggable key={todos[i].id} draggableId={todos[i].id} index={i}>
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
                            onClick={() =>
                              handleOpenModal(
                                todos[i].id,
                                todos[i].title,
                                todos[i].description,
                                todos[i].assignee,
                                todos[i].status
                              )
                            }
                          >
                            {todos[i].title.toUpperCase()}
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
                IN PROGRESS
              </Typography>
              <Droppable droppableId="inprogress">
                {(provided, snapshot) => (
                  <Box ref={provided.innerRef} minHeight={100}>
                    {progress.map((row, i) => (
                      <Draggable key={progress[i].id} draggableId={progress[i].id} index={i}>
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
                            onClick={() =>
                              handleOpenModal(
                                progress[i].id,
                                progress[i].title,
                                progress[i].description,
                                progress[i].assignee,
                                progress[i].status
                              )
                            }
                          >
                            {progress[i].title.toUpperCase()}
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
                TESTING
              </Typography>

              <Droppable droppableId="testing">
                {(provided, snapshot) => (
                  <Box ref={provided.innerRef} minHeight={100}>
                    {testing.map((row, i) => (
                      <Draggable key={testing[i].id} draggableId={testing[i].id} index={i}>
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
                            onClick={() =>
                              handleOpenModal(
                                testing[i].id,
                                testing[i].title,
                                testing[i].description,
                                testing[i].assignee,
                                testing[i].status
                              )
                            }
                          >
                            {testing[i].title.toUpperCase()}
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
                DONE
              </Typography>
              <Droppable droppableId="done">
                {(provided, snapshot) => (
                  <Box ref={provided.innerRef} minHeight={100}>
                    {done.map((row, i) => (
                      <Draggable key={done[i].id} draggableId={done[i].id} index={i}>
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
                            onClick={() =>
                              handleOpenModal(
                                done[i].id,
                                done[i].title,
                                done[i].description,
                                done[i].assignee,
                                done[i].status
                              )
                            }
                          >
                            {done[i].title.toUpperCase()}
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
      <DetailModal open={open} onClose={handleClose} title={title} description={description} assignee={assignee} status={status}/>
    </DashboardLayout>
  );
}

export default TaskList;
