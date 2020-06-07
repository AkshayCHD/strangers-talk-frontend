import React from 'react'
import { Box } from "@material-ui/core"
import { styled } from "@material-ui/core/styles"

export default function Navbar() {
	return (
		<NavBox>
			Stranger Talks
		</NavBox>
	)
}

const NavBox=styled(Box)(({ theme }) => ({
	width: "100vw",
	height: "8vh",
	boxSizing: "border-box",
	padding: "6px",
	paddingLeft: "10px",
	color: "white",
	display: "block",
	background: theme.palette.primary.main,
	fontSize: "30px"
}))
