import { useEffect, useState } from "react";
import styles from "./modal.module.css";
import PropTypes from "prop-types";
import { Typography, Box ,TextField, Button} from "@mui/material";
import Modal from "@mui/material/Modal";
import arrowImage from "../../../../assets/images/icons/arrow_back.svg";
import MDButton from "components/MDButton";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../authentication/FirebaseConfig";
import { getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const CreateProjectModal = (props) => {
  const { open, onClose } = props;
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(0);
  const [description, setDescription] = useState("");

  const clearTask = () => {
    onClose();
  };
  const createProject = async () => {
    try {
      const docRef = await addDoc(collection(db, "project"), {
        name: name,
        budget: budget,
        description: description,
      });
      onClose();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
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
          </Box>

          <Box className={styles.modal_heading}>
            <Typography variant="h5" className={styles.modal_child}>
              Create a new project
            </Typography>
          </Box>
          <Box>
            <TextField
            sx={{ marginBottom: "10px"}}
            label="Project Name"
            id="standard-start-adornment"
            variant="standard"
            onChange={(event) => setName(event.target.value)}
            fullWidth={true}
            />
            <TextField
            sx={{ marginBottom: "10px" }}
            type="number"
            label="Project Budget"
            id="standard-start-adornment"
            variant="standard"
            fullWidth={true}
            onChange={(event) => setBudget(event.target.value)}
            />
            <TextField
            sx={{marginBottom: "10px" }}
            id="standard-multiline-flexible"
            label="Project Discription"
            multiline
            maxRows={4}
            variant="standard"
            fullWidth={true}
            onChange={(event) => setDescription(event.target.value)}
           />
           <MDButton color="primary" onClick={createProject}>Save</MDButton>
           <MDButton color="dark" onClick={clearTask} sx={{marginLeft:"10px"}}>Cancel</MDButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
CreateProjectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func
};

export default CreateProjectModal;
