import React, { useContext, useEffect, useState, useCallback } from "react";
import { Button, Grid, Typography, Paper, TextField, Autocomplete } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
 
import FileUploadInput from "../lib/FileUploadInput";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  inputBox: {
    width: "100%",
    maxWidth: 420,
  },
}));

interface Education {
  institutionName: string;
  startYear: string | number;
  endYear?: string | number;
}

interface MultifieldInputProps {
  education: Education[];
  setEducation: (edu: Education[]) => void;
}

const MultifieldInput: React.FC<MultifieldInputProps> = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid item container className={classes.inputBox} key={key} spacing={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item style={{ alignSelf: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={classes.inputBox}
        >
          Add another institution details
        </Button>
      </Grid>
    </>
  );
};

const Profile: React.FC = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [] as Education[],
    skills: [] as string[],
    resume: "",
    profile: "",
  });

  const [education, setEducation] = useState<Education[]>([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const handleInput = (key: string, value: string) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  const getData = useCallback(() => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response: any) => {
        setProfileDetails(response.data);
        if (response.data.education && response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu: any) => ({
              institutionName: edu.institutionName || "",
              startYear: edu.startYear || "",
              endYear: edu.endYear || "",
            }))
          );
        }
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error fetching profile",
        });
      });
  }, [setPopup]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleUpdate = () => {
    let updatedDetails = {
      ...profileDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          const newObj = { ...obj };
          if (newObj.endYear === "") {
            delete newObj.endYear;
          }
          return newObj;
        }),
    };

    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response: any) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Update failed",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Profile</Typography>
      </Grid>
      <Grid item xs>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container direction="column" alignItems="stretch" spacing={3}>
            <Grid item>
              <TextField
                label="Name"
                value={profileDetails.name}
                onChange={(event) => handleInput("name", event.target.value)}
                className={classes.inputBox}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <MultifieldInput
              education={education}
              setEducation={setEducation}
            />
            <Grid item>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={profileDetails.skills}
                onChange={(_e, value) =>
                  setProfileDetails({
                    ...profileDetails,
                    skills: value as string[],
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className={classes.inputBox}
                    label="Skills"
                    variant="outlined"
                    helperText="Press enter to add skills"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item>
              <FileUploadInput
                className={classes.inputBox}
                label="Resume (.pdf)"
                icon={<DescriptionIcon />}
                uploadTo={apiList.uploadResume}
                handleInput={handleInput}
                identifier={"resume"}
              />
            </Grid>
            <Grid item>
              <FileUploadInput
                className={classes.inputBox}
                label="Profile Photo (.jpg/.png)"
                icon={<FaceIcon />}
                uploadTo={apiList.uploadProfileImage}
                handleInput={handleInput}
                identifier={"profile"}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px", marginTop: "30px" }}
            onClick={() => handleUpdate()}
          >
            Update Details
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
