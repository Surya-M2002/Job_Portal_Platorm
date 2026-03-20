import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";

interface MessagePopupProps {
  open: boolean;
  setOpen: (status: boolean) => void;
  severity: string;
  message: string;
}

const MessagePopup: React.FC<MessagePopupProps> = (props) => {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    props.setOpen(false);
  };

  return (
    <Snackbar open={props.open} onClose={handleClose} autoHideDuration={2000}>
      <Alert onClose={handleClose} severity={props.severity as AlertColor}>
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default MessagePopup;
