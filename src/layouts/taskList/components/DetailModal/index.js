import styles from "./modal.module.css";
import PropTypes from "prop-types";
import { Typography, Box, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import { deleteDoc ,doc} from "firebase/firestore";
import { db } from "../../../authentication/FirebaseConfig";
import arrowImage from "../../../../assets/images/icons/arrow_back.svg";
import statusImage from "../../../../assets/images/icons/status.svg";
import assigneeImage from "../../../../assets/images/icons/assignee.svg";
import deleteImage from "../../../../assets/images/icons/delete.svg";

const DetailModal = (props) => {
  const { open, onClose, title, description, assignee, status ,id} = props;

  const deleteTask = async() => {
    onClose();
    await deleteDoc(doc(db, "tasks", id));
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
            <img src={deleteImage} alt="delete" className={styles.delete} width={30} height={30} onClick={deleteTask}/>
          </Box>

          <Box className={styles.modal_heading}>
            <Typography variant="h3" className={styles.modal_child}>
              {title}
            </Typography>
          </Box>
          <Box className={styles.modal_status}>
            <img
              src={statusImage}
              alt="status"
              width={30}
              height={30}
              style={{ marginRight: "10px" }}
            />
            <Typography>
              Status:<span className={styles.gap}> {status}</span>
            </Typography>
          </Box>
          <Box className={styles.modal_status}>
            <img
              src={assigneeImage}
              alt="status"
              width={30}
              height={30}
              style={{ marginRight: "10px" }}
            />
            <Typography>
              Assignee:<span className={styles.gap}> {assignee}</span>
            </Typography>
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
