import PropTypes from 'prop-types';

const Card = ({width,height,children}) => {
  return (
    <div style={{
      // backgroundColor: '#49a3f1',
      background: 'linear-gradient(195deg,#b4d2fa, #7cc1fc)',
      borderRadius: '10px',
      padding: '8px',
      color: 'black',
      height: height,
      margin: '20px',
      width: width,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Poppins',
      display: 'flex',
      flexDirection: 'column',
      //alignItems: 'center'
    }}>
      {children}
    </div>
  );
};
Card.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    children: PropTypes.node
  };

export default Card;