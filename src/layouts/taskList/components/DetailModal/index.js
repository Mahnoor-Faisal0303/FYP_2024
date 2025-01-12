import styles from "./modal.module.css";
import PropTypes from "prop-types";
import { Typography, Box, Button, Select, MenuItem, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import MDButton from "components/MDButton";
import {
  deleteDoc,
  doc,
  collection,
  onSnapshot,
  updateDoc,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../authentication/FirebaseConfig";
import arrowImage from "../../../../assets/images/icons/arrow_back.svg";
import statusImage from "../../../../assets/images/icons/status.svg";
import assigneeImage from "../../../../assets/images/icons/assignee.svg";
import deleteImage from "../../../../assets/images/icons/delete.svg";
import React, { useEffect, useState } from "react";
import { appAuth } from "../../../authentication/FirebaseConfig";
import { getDocs } from "firebase/firestore";

const DetailModal = (props) => {
  const { open, onClose, title, description, assignee, status, id } = props;

  const [tempTitle, setTempTitle] = useState(title);
  const [tempDescription, setTempDescription] = useState(description);
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setTempTitle(e.target.value);
  };
  const handleChangeDetail = (e) => {
    setTempDescription(e.target.value);
  };

  useEffect(()=> {
    setTempTitle(title);
    setTempDescription(description);
  },[id, title , description]);

  const handleSave = async () => {
    try {
      const taskDocRef = doc(db, "tasks", id);
      await updateDoc(taskDocRef, {
        title: tempTitle,
        description: tempDescription,
      });
      setIsEditing(false);
      console.log("Title updated successfully");
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };
  const deleteTask = async () => {
    onClose();
    await deleteDoc(doc(db, "tasks", id));
  };

  const [selectedAssignee, setSelectedAssignee] = useState("Unassigned");
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");

  useEffect(() => {
    const capitalizeName = (name) => {
      if (!name) return "Unknown"; // Handle null or undefined names
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };
    setSelectedAssignee("Unassigned");

    const getUsers = () => {
      onSnapshot(collection(db, "users"), (querySnapshot) => {
        let usersData = [{ name: "Unassigned" }];

        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`, doc.data());
          let docData = doc.data();
          docData.name = capitalizeName(docData.name);
          usersData.push(docData);

          if (capitalizeName(assignee) == capitalizeName(docData.name)) {
            setSelectedAssignee(capitalizeName(assignee));
          }
        });
        setUsers(usersData);
      });
    };
    getUsers();
  }, [assignee]);

  useEffect(() => {
    const user = appAuth.currentUser; // Get the current user from Firebase Auth
    console.log("user: ", user);
    if (user) {
      const currentUserId = user.uid; // Get the current user's ID
      console.log("currentUserId: ", currentUserId);
      console.log("users: ", users);
      const currentUser = users.find((user) => user.uid === currentUserId);
      console.log("currentUser: ", currentUser);
      if (currentUser) {
        setCurrentUserName(currentUser.name);
      }
    }
  }, [users]);

  // Fetch comments for the task
  useEffect(() => {
    if (!id) return; // Ensure id is defined
    setComments([]);
    const commentsRef = collection(db, "comments");
    const q = query(commentsRef, where("taskId", "==", id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() });
      });
      console.log("Comments Data: ", commentsData);
      // Sort comments by timestamp (newest first)
      commentsData.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
      setComments(commentsData);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [id]);

  useEffect(() => {
    setSelectedStatus(status);
  }, [id]);

  const handleSelectedAssignee = async (event) => {
    const docRef = doc(db, "tasks", id);

    let assigneeValue = event.target.value;

    setSelectedAssignee(assigneeValue);
    await updateDoc(docRef, {
      assignee: assigneeValue,
    });
  };

  const handleStatusChange = async (event) => {
    const docRef = doc(db, "tasks", id);
    let statusValue = event.target.value;

    setSelectedStatus(statusValue);
    await updateDoc(docRef, {
      status: statusValue,
    });
  };

  // Handle sending a new comment
  const handleSendComment = async () => {
    if (newComment.trim() === "") return;

    // Create a timestamp with the current date and time
    const timestamp = new Date(); // Get current date and time

    const commentData = {
      taskId: id,
      userName: currentUserName,
      comment: newComment,
      timestamp: timestamp, // Include the timestamp
    };

    try {
      await addDoc(collection(db, "comments"), commentData);
      setNewComment(""); // Clear input
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modal_container}>
        <Box className={styles.modal}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <img
              src={arrowImage}
              alt="arrow"
              className={styles.arrow}
              width={30}
              height={30}
              onClick={onClose}
            />
            <img
              src={deleteImage}
              alt="delete"
              className={styles.delete}
              width={30}
              height={30}
              onClick={deleteTask}
            />
          </Box>
          <Box className={styles.parent}>
            <Box className={styles.scroll}>
              <Box className={styles.modal_heading}>
                {isEditing ? (
                  <>
                    <TextField
                      value={tempTitle}
                      onChange={handleChange}
                      autoFocus
                      variant="standard"
                      size="small"
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          fontSize: "22px",
                          fontWeight: "bold",
                          color: "black",
                        },
                      }}
                      sx={{width:'100%'}}
                    />
                  </>
                ) : (
                  <>
                    <TextField
                      value={tempTitle}
                      size="small"
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        readOnly: true,
                        style: {
                          fontSize: "22px",
                          fontWeight: "bold",
                          color: "black",
                        },
                      }}
                      sx={{width:'100%'}}
                      onClick={handleClick}
                    />
                  </>
                )}
              </Box>
              <hr style={{ marginTop: "4px" }} />
              <Box className={styles.modal_detail} >
                <Typography variant="h4" className={styles.detailH}>
                  Details
                </Typography>
                {isEditing ? 
                (
                  <TextField
                      value={tempDescription}
                      onChange={handleChangeDetail}
                      autoFocus
                      variant="standard"
                      sx={{width:'100%'}}
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          fontSize: "14px",
                          color: "black",
                        },
                      }}
                    />
                ):(
                  <TextField
                      value={tempDescription}
                      size="small"
                      variant="standard"
                      sx={{width:'100%'}}
                      InputProps={{
                        disableUnderline: true,
                        readOnly: true,
                        style: {
                          fontSize: "14px",
                          color: "black",
                        },
                      }}
                      onClick={handleClick}
                    />
                )}
              </Box>
              <hr style={{ margin: "4px 0" }} />
              {isEditing ? (
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={handleSave}
                  style={{ marginTop: "4px",marginBottom:"10px" }}
                >
                  Save
                </MDButton>
              ) : (
                <></>
              )}
              <Box className={styles.commentSection}>
                <Typography variant="h6">Comments</Typography>
                <Box display="flex" alignItems="center" marginTop="10px">
                  <TextField
                    variant="outlined"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    multiline
                    rows={4}
                    style={{ flexGrow: 1, marginRight: "10px" }}
                  />

                  <MDButton variant="gradient" color="info" onClick={handleSendComment}>
                    Send
                  </MDButton>
                </Box>
                <Box marginTop="10px">
                  {comments.map((comment) => (
                    <Box key={comment.id} marginBottom="10px">
                      <Typography variant="body2">
                        <strong>{comment.userName}</strong> |{" "}
                        {comment.timestamp instanceof Timestamp
                          ? comment.timestamp.toDate().toLocaleString()
                          : "Invalid date"}
                      </Typography>
                      <Typography variant="body1" style={{ marginTop: "5px" }}>
                        {comment.comment}
                      </Typography>
                      <hr style={{ margin: "10px 0" }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box>
              <Box
                className={styles.modal_status}
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src={statusImage}
                  alt="status"
                  width={30}
                  height={30}
                  style={{ marginRight: "10px", padding: "2px" }}
                />
                <Typography width={100} style={{ fontSize: "16px" }}>
                  Status:{" "}
                </Typography>
                <Select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  style={{ marginLeft: "10px", minWidth: "120px", padding: "6px" }}
                >
                  <MenuItem value="todo">Todo</MenuItem>
                  <MenuItem value="inprogress">In Progress</MenuItem>
                  <MenuItem value="testing">Testing</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </Box>
              <Box
                className={styles.modal_status}
                style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
              >
                <img
                  src={assigneeImage}
                  alt="status"
                  width={30}
                  height={30}
                  style={{ marginRight: "10px", padding: "2px" }}
                />
                <Typography width={100} style={{ fontSize: "16px" }}>
                  Assignee:
                </Typography>
                <Select
                  key={id}
                  value={selectedAssignee}
                  onChange={handleSelectedAssignee}
                  className={styles.gap}
                  style={{
                    marginLeft: "10px",
                    minWidth: "120px",
                    textTransform: "none",
                    padding: "6px",
                  }}
                >
                  {users.map((user, index) => (
                    <MenuItem key={index} value={user.name}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Box>
          {/* <Box className={styles.modal_heading}>
            <Typography variant="h3" className={styles.modal_child}>
              {title}
            </Typography>
          </Box> */}
          {/* <Box className={styles.modal_status} style={{ display: "flex", alignItems: "center" }}>
            <img
              src={statusImage}
              alt="status"
              width={30}
              height={30}
              style={{ marginRight: "10px", padding: "2px" }}
            />
            <Typography width={100} style={{ fontSize: "16px" }}>Status: </Typography>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              style={{ marginLeft: "10px", minWidth: "120px", padding: "6px" }}
            >
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="inprogress">In Progress</MenuItem>
              <MenuItem value="testing">Testing</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </Box>
          <Box className={styles.modal_status} style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
            <img
              src={assigneeImage}
              alt="status"
              width={30}
              height={30}
              style={{ marginRight: "10px", padding: "2px" }}
            />
            <Typography width={100} style={{ fontSize: "16px" }}>Assignee:</Typography>
            <Select
              value={selectedAssignee}
              onChange={handleSelectedAssignee}
              className={styles.gap}
              style={{
                marginLeft: "10px",
                minWidth: "120px",
                textTransform: "none",
                padding: "6px",
              }}
            >
              {users.map((user, index) => (
                <MenuItem key={index} value={user.name}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </Box> */}
          {/* <hr style={{ marginTop: "20px" }} />
          <Box className={styles.modal_detail}>
            <Typography variant="h4" className={styles.detailH}>
              Details
            </Typography>
            <Typography className={styles.detail}>{description}</Typography>
          </Box> */}
          {/* <hr style={{ margin: "10px 0" }} />
          <Box className={styles.commentSection}>
            <Typography variant="h6">Comments</Typography>
            <Box display="flex" alignItems="center" marginTop="10px">
              <TextField
                variant="outlined"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                multiline
                rows={4}
                style={{ flexGrow: 1, marginRight: "10px" }}
              />
              <Button variant="contained" onClick={handleSendComment}>
                Send
              </Button>
            </Box>
            <Box marginTop="10px">
              {comments.map((comment) => (
                <Box key={comment.id} marginBottom="10px">
                  <Typography variant="body2">
                    <strong>{comment.userName}</strong> |{" "}
                    {comment.timestamp instanceof Timestamp
                      ? comment.timestamp.toDate().toLocaleString()
                      : "Invalid date"}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: "5px" }}>
                    {comment.comment} 
                  </Typography>
                  <hr style={{ margin: "10px 0" }} />
                </Box>
              ))}
            </Box>
          </Box> */}
        </Box>
      </Box>
    </Modal>
  );
};
DetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  assignee: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  id: PropTypes.string.isRequired,
};

export default DetailModal;
