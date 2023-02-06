import React, { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ethers } from "ethers";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Upload from "./Upload";
import { Group } from "@semaphore-protocol/group";

const theme = createTheme();

export default function IssueCred(props) {
  const { address } = useParams();

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Container component="main" >
          <Upload />
        </Container>
      </ThemeProvider>
    </div>
  );
}
