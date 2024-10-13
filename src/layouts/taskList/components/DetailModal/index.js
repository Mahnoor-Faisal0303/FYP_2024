import styles from "./modal.module.css";
import PropTypes from "prop-types";
import { Typography, Box, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import arrowImage from "../../../../assets/images/icons/arrow_back.svg";
import statusImage from "../../../../assets/images/icons/status.svg";
import assigneeImage from "../../../../assets/images/icons/assignee.svg";

const DetailModal = (props) => {
  const { open, onClose, title, description, assignee, status } = props;
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modal_container}>
        <Box className={styles.modal}>
          <img src={arrowImage} alt="arrow" className={styles.arrow} onClick={onClose} />
          <Box className={styles.modal_heading}>
            <Typography variant="h3" className={styles.modal_child}>{title}</Typography>
          </Box>
          <Box className={styles.modal_status}>
            <img src={statusImage} alt="status" width={30} height={30} style={{marginRight:"10px"}}/>
            <Typography>Status:<span className={styles.gap}> {status}</span></Typography>
          </Box>
          <Box className={styles.modal_status}>
            <img src={assigneeImage} alt="status" width={30} height={30} style={{marginRight:"10px"}}/>
            <Typography>Assignee:<span className={styles.gap}> {assignee}</span></Typography>
          </Box>

          <Box className={styles.modal_detail}>
          <Typography variant="h4" className={styles.detailH}>
            Details
          </Typography>
          <Typography className={styles.detail}>
            {description}
          </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
DetailModal.propTypes = {
  open: PropTypes.bool.isRequired, // 'open' must be a boolean
  title: PropTypes.string.isRequired, // 'title' must be a string
  description: PropTypes.string.isRequired, // 'description' must be a string
  assignee: PropTypes.string.isRequired, // 'assignee' must be a string
  status: PropTypes.string.isRequired, // 'status' must be a string
  onClose: PropTypes.func, // 'onClose' must be a function (optional)
};

export default DetailModal;
