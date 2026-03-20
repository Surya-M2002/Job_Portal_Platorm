import React, { useState, useEffect, useContext, useCallback } from "react";
import { Button, Chip, Grid, Paper, Typography, Modal,
  Theme
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Rating from "@mui/material/Rating";
import axios from "axios";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";

const useStyles = makeStyles((theme: Theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

interface Application {
  _id: string;
  status: string;
  dateOfApplication: string;
  dateOfJoining: string;
  job: {
    _id: string;
    title: string;
    jobType: string;
    salary: number;
    duration: number;
    skillsets: string[];
    rating: number;
  };
  recruiter: {
    name: string;
  };
}

interface ApplicationTileProps {
  application: Application;
}

const ApplicationTile: React.FC<ApplicationTileProps> = (props) => {
  const classes = useStyles();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response: any) => {
        setRating(response.data.rating);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error fetching rating",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response: any) => {
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Update failed",
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet: { [key: string]: string } = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{application.job.title}</Typography>
          </Grid>
          <Grid item>Posted By: {application.recruiter.name}</Grid>
          <Grid item>Role : {application.job.jobType}</Grid>
          <Grid item>Salary : &#8377; {application.job.salary} per month</Grid>
          <Grid item>
            Duration :{" "}
            {application.job.duration !== 0
              ? `${application.job.duration} month`
              : `Flexible`}
          </Grid>
          <Grid item>
            {application.job.skillsets.map((skill, index) => (
              <Chip key={index} label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>Applied On: {appliedOn.toLocaleDateString()}</Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>Joined On: {joinedOn.toLocaleDateString()}</Grid>
          ) : null}
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item xs>
            <Paper
              className={classes.statusBlock}
              style={{
                background: colorSet[application.status],
                color: "#ffffff",
              }}
            >
              {application.status}
            </Paper>
          </Grid>
          {application.status === "accepted" ||
          application.status === "finished" ? (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={classes.statusBlock}
                onClick={() => {
                  fetchRating();
                  setOpen(true);
                }}
              >
                Rate Job
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Rating
            name="simple-controlled"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => changeRating()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Applications: React.FC = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState<Application[]>([]);

  const getData = useCallback(() => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response: any) => {
        setApplications(response.data);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error fetching applications",
        });
      });
  }, [setPopup]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Applications</Typography>
      </Grid>
      <Grid
        container
        item
        xs
        direction="column"
        style={{ width: "100%" }}
        alignItems="stretch"
        justifyContent="center"
      >
        {applications.length > 0 ? (
          applications.map((obj) => (
            <Grid item key={obj._id}>
              <ApplicationTile application={obj} />
            </Grid>
          ))
        ) : (
          <Typography variant="h5" style={{ textAlign: "center" }}>
            No Applications Found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
