import React from 'react'
import {Box} from "@material-ui/core"
import {styled} from "@material-ui/core/styles"
// Declarative Stream Player for React
// Wrapped around native HTML video and audio tag with added Agora features
import StreamPlayer from "agora-stream-player";

export default function StreamArea({remoteStreamList, localStream} : any) {
    return (
			<MainArea>
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
			</MainArea>
    )
}

const MainArea=styled(Box)(({theme})=>({
    background:"#aaadab",
    padding:"10px",
    display:"flex",
    justifyContent:"space-evenly",
    width:"80vw",
    height:"80vh",
    margin:"1px",
    marginLeft:"auto",
    marginRight:"auto",
    overflow:"scroll"
}))
