import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";

interface MessagePopupProps {
  open: boolean;
  setOpen: (status: boolean) => void;
  severity: string;
  message: string;
}

const MessagePopup: React.FC<MessagePopupProps> = (props) => {
  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    props.setOpen(false);
  };

  return (
    <Snackbar open={props.open} onClose={handleClose} autoHideDuration={2000}>
      <Alert onClose={handleClose} severity={props.severity as Color}>
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default MessagePopup;
