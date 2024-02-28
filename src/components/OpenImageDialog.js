import { Modal } from "@mui/material";
import React from "react";
import ClearIcon from "@mui/icons-material/Clear";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  backgroundColor: "white",
  padding: "20px",
  transform: "translate(-50%, -50%)",
  width: 600, // Default width for larger screens
  height: 400, // Default height for larger screens

  // Media query for screens with a max-width of 400px
  "@media screen and (max-width: 400px)": {
    width: 200, // Width for screens with a max-width of 400px
  },

  // Media query for screens with a max-width of 620px
  "@media screen and (max-width: 620px)": {
    width: 300, // Width for screens with a max-width of 620px
  },

  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const OpenImageDialog = (props) => {
  //   const handleOpen = () => props.setOpen(true);
  const handleClose = () => props.setOpen(false);
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;

  const isBlobURL = (url) => {
    return url.startsWith("blob:");
  };
  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "transparent",
          border: "2px solid #000",
          padding: "2rem",
        }}
      >
        <img
          style={style}
          src={
            !isBlobURL(props.selectedImage)
              ? `${imageGetUrl}/${props.selectedImage}`
              : props.selectedImage
          }
          alt="Image"
        />
        <ClearIcon
          style={{
            cursor: "pointer",
            position: "absolute",
            top: "-170px",
            right: "-270px",
            color: "black",
          }}
          onClick={handleClose}
        />
      </div>
    </Modal>
  );
};
