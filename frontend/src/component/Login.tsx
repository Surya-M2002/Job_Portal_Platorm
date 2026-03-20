import React, { useContext, useState } from "react";
import { Grid, Button, Typography, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Redirect } from "react-router-dom";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    padding: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(6),
    },
  },
  inputBox: {
    width: "100%",
    maxWidth: 360,
  },
   submitButton: {
    width: "100%",
    maxWidth: 360,
  },
}));

const Login: React.FC = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(!!isAuth());

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState<any>({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key: string, value: string) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key: string, status: boolean, message: string) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      axios
        .post(apiList.login, loginDetails)
        .then((response: any) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(!!isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response?.data?.message || "Login failed",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <Paper elevation={3} className={classes.body}>
      <Grid container direction="column" spacing={4} alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h2">
            Login
          </Typography>
        </Grid>
        <Grid item>
          <EmailInput
            label="Email"
            value={loginDetails.email}
            onChange={(event: any) => handleInput("email", event.target.value)}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            className={classes.inputBox}
          />
        </Grid>
        <Grid item>
          <PasswordInput
            label="Password"
            value={loginDetails.password}
            onChange={(event: any) => handleInput("password", event.target.value)}
            className={classes.inputBox}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLogin()}
            className={classes.submitButton}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Login;
