import styles from "./modal.module.css";
import PropTypes from "prop-types";
import { Typography, Box, Button, Select, MenuItem } from "@mui/material";
import Modal from "@mui/material/Modal";
import { deleteDoc, doc, collection, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../authentication/FirebaseConfig";
import arrowImage from "../../../../assets/images/icons/arrow_back.svg";
import statusImage from "../../../../assets/images/icons/status.svg";
import assigneeImage from "../../../../assets/images/icons/assignee.svg";
import deleteImage from "../../../../assets/images/icons/delete.svg";
import React, { useEffect, useState } from "react";

const DetailModal = (props) => {
  const { open, onClose, title, description, assignee, status, id } = props;

  const deleteTask = async () => {
    onClose();
    await deleteDoc(doc(db, "tasks", id));
  };

  const [selectedAssignee, setSelectedAssignee] = useState("Unassigned");
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(status);

  useEffect(() => {
    const capitalizeName = (name) => {
      if (!name) return "Unknown"; // Handle null or undefined names
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };
    setSelectedAssignee("Unassigned");

    const getUsers = () => {
      onSnapshot(collection(db, "users"), (querySnapshot) => {

        let usersData = ["Unassigned"];

        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`, doc.data());
          let docData = doc.data();
          usersData.push(capitalizeName(docData.name));
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
    setSelectedStatus(status);
  }, [status]);

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

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modal_container}>
        <Box className={styles.modal}>
          <Box display={"flex"} justifyContent={"space-between"} marginBottom="10px">
            <img
              src={arrowImage}
              alt="arrow"
              className={styles.arrow}
              width={30}
              height={30}
              onClick={onClose}
            />
            <img src={deleteImage} alt="delete" className={styles.delete} width={30} height={30} onClick={deleteTask} />
          </Box>

          <Box className={styles.modal_heading}>
            <Typography variant="h3" className={styles.modal_child}>
              {title}
            </Typography>
          </Box>
          <Box className={styles.modal_status} style={{ display: "flex", alignItems: "center" }}>
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
                <MenuItem key={index} value={user}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box className={styles.modal_detail}>
            <Typography variant="h4" className={styles.detailH}>
              Details
            </Typography>
            <Typography className={styles.detail}>{description}</Typography>
          </Box>
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
