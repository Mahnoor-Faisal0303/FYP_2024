import PropTypes from "prop-types";
import { Typography, TextField } from "@mui/material";
import { styled } from '@mui/system';

const CustomTextField = styled(TextField)(() => ({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none',
      },
      padding: '10px',
    },
    '& .MuiInputBase-input': {
      fontSize: '30px',
      textAlign: 'center',
    },
  }));
  

const Task = ({ heading, subheading }) => {
  return (
    <>
      <Typography fontSize="20px">{heading}</Typography>
      <CustomTextField placeholder="0"/>
      <Typography fontSize="20px" alignSelf="center">
        {subheading}
      </Typography>
    </>
  );
};
Task.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
};

export default Task;
