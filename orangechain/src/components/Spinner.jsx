import { Vortex } from 'react-loader-spinner';

function Spinner() {
  const spinnerStyle = {
    height: "110px",
    width: "110px",
    borderRadius: "9px",
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={spinnerStyle}>
      <Vortex
        height={110} // Adjust this value as needed
        width={110}  // Adjust this value as needed
        color="white"
        ariaLabel="loading"
      />
    </div>
  );
}

export default Spinner;
