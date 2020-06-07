# Strangers Talk (Frontend)

## Overview
The project is a realtime video chat application that allows you to chat live, with strangers in realtime. The project uses [Agora.io](https://www.agora.io/en/)
libraries for registering video and audio streams, and [Strangers Talk Backend](https://github.com/AkshayCHD/strangers-talk-backend) that is a websocket server, responsible for managing and connecting various websocket connections in the required manner.

## Getting Started

**NOTE:** Before running the frontend make sure you have the [Strangers Talk Backend](https://github.com/AkshayCHD/strangers-talk-backend) project up and running.
   
To run the project, perform the following steps

```
git clone https://github.com/AkshayCHD/strangers-talk-frontend.git
cd strangers-talk-frontend
npm install
npm start
```

Then you must add the appId of your agora project in the `.env` file in root directory. To create a agora project and get appId from it follow the [link](https://docs.agora.io/en/Agora%20Platform/manage_projects?platform=All%20Platforms).
To create `.env` file run
```
touch .env
``` 
in the root directory of the project. Then add the following in `.env` file.
```
REACT_APP_AGORA_APP_ID="YOUR_AGORA_APP_ID"
```

## Project Demo
The following is the gif demo of the project
![Strangers Talk Frontend](https://drive.google.com/uc?export=view&id=1bTfPIqUjxEnSVmVNyqyoG0rxWZIAigF0)
