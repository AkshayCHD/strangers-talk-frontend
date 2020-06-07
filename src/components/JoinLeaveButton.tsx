import React from 'react'
import {Button} from "@material-ui/core"
import {styled} from "@material-ui/core/styles"

export default function JoinLeaveButton({ isJoined, isLoading, loginRequest, leave } : any) {
	return (
		<ButtonC
			color={isJoined ? "secondary" : "primary"}
			onClick={isJoined ? leave : loginRequest}
			variant="contained"
			disabled={isLoading}
		>
			{isJoined ? "Leave" : "Join"}
		</ButtonC>
	)
}
const ButtonC=styled(Button)(({theme})=>({
	margin:"5px",
	marginLeft:"50vw",
}))
