/* global BigInt */
import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import QRCode from "qrcode";
import User from "../../assets/user.jpeg";
import Claim from "../../assets/claim.png";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import QrReader from "react-qr-reader";
import TextField from "@mui/material/TextField";
import {
  EXAMPLE_ISSUER_ADDRESS,
  EXAMPLE_ISSUER_ABI,
} from "../../CredsProtocolConstants.js";

import { Group } from "@semaphore-protocol/group";
import { ethers } from "ethers";
import { Identity } from "@semaphore-protocol/identity";

const theme = createTheme();

export default function Profile() {

  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = React.useState(false);
  const [scanResultFile, setScanResultFile] = useState("");
  const [credid, setCredID] = useState();

  const qrRef = useRef(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorFile = (error) => {
    console.log(error);
  };

  const handleScanFile = async (result) => {
    if (result) {
      setScanResultFile(result);
      console.log(result);
      console.log("Integrate Contract Here Cred ID : ", credid);

      const group = new Group();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        EXAMPLE_ISSUER_ADDRESS,
        EXAMPLE_ISSUER_ABI,
        signer
      );

      console.log(contract);

      var temp = new Array();

      temp = result.split(",");
      console.log(temp)
      const metadataAgain = {
        Identity: {        
          _trapdoor: BigInt(temp[0]),
          _nullifier: BigInt(temp[1]),
          _commitment: BigInt(temp[2]),
          trapdoor: BigInt(temp[0]),
          nullifier: BigInt(temp[1]),
          commitment: BigInt(temp[2])
        }
      }
      console.log(metadataAgain.Identity.commitment)

      group.addMember(metadataAgain.Identity.commitment);
      console.log(credid)
      console.log(group.members[0])
      const tx = await contract.claimCred(
        credid,
        group.members[0],
        {
          gasLimit: 1000000000
        }
      );

      console.log(tx);
      handleClose();
    }

  };

  const onScanFile = () => {
    qrRef.current.openImageDialog();
  };

  const generateCredIDQrCode = async () => {
    try {
      console.log("Hello");
      const message =
        "Welcome to Creds Protocol ! To generate your Creds ID sign this message";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      const identity = new Identity(signature);
      console.log(identity)
      var commitment = identity.generateCommitment()
      var iden = [identity._trapdoor, identity._nullifier, commitment]
      console.log(iden)
      const response = await QRCode.toDataURL(iden.toString());
      setImageUrl(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {imageUrl ? (
            <a href={imageUrl} download>
              <img src={imageUrl} alt="img" style={{ width: "200px" }} />
            </a>
          ) : (
            <>
              <img src={User} style={{ width: "200px" }} />
              <Button onClick={() => generateCredIDQrCode()}>
                Generate Cred ID QR
              </Button>
            </>
          )}
        </Box>
        <br />
        <Divider variant="middle"></Divider>
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={Claim} style={{ width: "200px" }} />
          <Button onClick={handleClickOpen}>Claim Cred</Button>
        </Box>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Cred ID"
              name="name"
              autoFocus
              onChange={(e) => setCredID(e.target.value)}
            />
            <Button
              style={{
                width: "550px",
                height: "40px",
                marginTop: "1%",
                backgroundColor: "#41DCF5",
                color: "white",
                border: "none",
                borderRadius: "10px",
              }}
              onClick={onScanFile}
            >
              Claim Cred
            </Button>

            <br />
            <br />
            <QrReader
              ref={qrRef}
              delay={300}
              style={{ width: "100%" }}
              onError={handleErrorFile}
              onScan={handleScanFile}
              legacyMode
            />
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
