import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import io from 'socket.io-client'

// Declarative Stream Player for React
// Wrapped around native HTML video and audio tag with added Agora features
import StreamPlayer from "agora-stream-player";

import { SnackbarProvider, useSnackbar } from "notistack";

// These customs hooks let any components in the application
// to directly use the required parameters and create clean functional components.
// useCamera hook returns a list of cameras when the hook is called
// useMicrophone hook returns a list of microphones when the hook is called
// useMediaStream hook returns localStream, a list of remote streams and
// a contatenated list of localstream and remote streams when the hook is called
import { useMediaStream } from "./hooks";

// This is an enhanced Web SDK. The enhancement basically converts the callback syntax into promises.
// Rest of the code will use async/await syntax in conjuction with these promises.
import AgoraRTC from "./utils/AgoraEnhancer";

const socket = io('http://localhost:4000/')

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 12
  },
  title: {
    fontWeight: 400
  },
  divider: {
    marginBottom: "32px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around"
  },
  buttonItem: {
    width: "38.2%"
  },
  advanceSettings: {
    marginTop: 16
  }
}));

interface DefaultState {
  appId: string;
  channel: string;
  uid: string;
  token: any,
  cameraId: string;
  microphoneId: string;
  mode: "rtc" | "live";
  codec: "h264" | "vp8";
}
const defaultState: DefaultState = {
  appId: "",
  channel: "",
  uid: "",
  token: undefined,
  cameraId: "",
  microphoneId: "",
  mode: "rtc",
  codec: "h264"
};


function App() {
  // Declaring different states used by our application.
  const classes = useStyles();
  const [isJoined, setisJoined] = useState(false);

  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agoraClient, setClient] = useState<any>(undefined)

  let [localStream, remoteStreamList, streamList] = useMediaStream(agoraClient);

	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
    socket.on('roomCreated', async (data: any) => {
			console.log(data)
			let channel = data.room.toString()
			const client = AgoraRTC.createClient({ mode: defaultState.mode, codec: defaultState.codec })
			setClient(client)
			try {
				const uid = isNaN(Number(defaultState.uid)) ? null : Number(defaultState.uid);

				// initializes the client with appId
				let appid = process.env.REACT_APP_AGORA_APP_ID
				await client.init(appid?.toString() || "");

				// joins a channel with a token, channel, user id
				await client.join(defaultState.token, channel, uid);

				// create a ne stream
				const stream = AgoraRTC.createStream({
					streamID: uid || 12345,
					video: true,
					audio: true,
					screen: false
				});

				// stream.setVideoProfile('480p_4')

				// Initalize the stream
				await stream.init();

				// Publish the stream to the channel.
				await client.publish(stream);

				// Set the defaultState appropriately
				setIsPublished(true);
				setisJoined(true);
				enqueueSnackbar(`Joined channel ${channel}`, { variant: "info" });
			} catch (err) {
				console.log(err)
				enqueueSnackbar(`Failed to join, ${err}`, { variant: "error" });
			} finally {
				setIsLoading(false);
			}
    })

    socket.on('roomDeleted', async (data: any) => {
      enqueueSnackbar(`Pair left channel ${data.room}`, { variant: "info" });
    })
  }, [])

  const loginRequest = async () => {
    const client = AgoraRTC.createClient({ mode: defaultState.mode, codec: defaultState.codec })
    // Loads client into the defaultState
    setClient(client)
    setIsLoading(true);
    socket.emit("login")
  }

  // Leaves the channel on invoking the function call.
  const leave = async () => {
    setIsLoading(true);
    try {
      if (localStream) {
        // Closes the local stream. This de-allocates the resources and turns off the camera light
        localStream.close();
        // unpublish the stream from the client
        agoraClient.unpublish(localStream);
      }
      // leave the channel
			await agoraClient.leave();

      socket.emit('logout')
      setIsPublished(false);
			setisJoined(false);
      setClient(undefined)
      enqueueSnackbar("Left channel", { variant: "info" });
    } catch (err) {
      console.log(err)
      enqueueSnackbar(`Failed to leave, ${err}`, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const JoinLeaveBtn = () => {
    return (
      <Button
        className={classes.buttonItem}
        color={isJoined ? "secondary" : "primary"}
        onClick={isJoined ? leave : loginRequest}
        variant="contained"
        disabled={isLoading}
      >
        {isJoined ? "Leave" : "Join"}
      </Button>
    );
  };


  return (
    <React.Fragment>
      <AppBar color="primary">
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            Basic Communication
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.divider} />
      <Container>
        <Grid container spacing={3}>
          {/* form */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardActions className={classes.buttonContainer}>
                <JoinLeaveBtn />
              </CardActions>
            </Card>
          </Grid>

          {/* display area */}
          <Grid item xs={12} md={8}>
            {localStream && (
              <StreamPlayer stream={localStream} fit="contain" label="local" />
            )}
            {remoteStreamList.map((stream: any) => (
              <StreamPlayer
                key={stream.getId()}
                stream={stream}
                fit="contain"
                label={stream.getId()}
              />
            ))}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default function AppWithNotification() {
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={2500}
      maxSnack={5}
    >
      <App />
    </SnackbarProvider>
  );
}
