/* global BigInt */
import React, { useState, useRef } from "react";
import {
  Container,
  Card,
  CardContent,
  makeStyles,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import QrReader from "react-qr-reader";
import {
  generateProof,
  packToSolidityProof,
  verifyProof,
} from "@semaphore-protocol/proof";
import { ethers } from "ethers";
import {
  EXAMPLE_ISSUER_ADDRESS,
  EXAMPLE_ISSUER_ABI,
} from "../../CredsProtocolConstants.js";
import { Group } from "@semaphore-protocol/group";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";

function ExampleVerifyCred() {
  const [open, setOpen] = React.useState(false);
  const [verified, setVerified] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [scanResultFile, setScanResultFile] = useState("");
  const [scanResultWebCam, setScanResultWebCam] = useState("");
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

  const handleScanFile = (result) => {
    if (result) {
      setScanResultFile(result);
  
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
      console.log(metadataAgain.Identity)
      const group = new Group(16);
      verifyCred(metadataAgain.Identity, group, 1);
    }
  };

  const onScanFile = () => {
    qrRef.current.openImageDialog();
  };

  const wasmFilePath = "../static/semaphore.wasm";
  const zkeyFilePath = "../static/semaphore.zkey";
  const signal = "Welcome to Creds Protocol";

  const verifyCred = async (identity, group, credid) => {

    // const fullProof = await generateProof(identity, group, credid, signal, {
    //   wasmFilePath,
    //   zkeyFilePath,
    // });

    // const solidityProof = packToSolidityProof(fullProof.proof);

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send("eth_requestAccounts", []);
    // const signer = await provider.getSigner();
    // const contract = new ethers.Contract(
    //   EXAMPLE_ISSUER_ADDRESS,
    //   EXAMPLE_ISSUER_ABI,
    //   signer
    // );
    // console.log(contract);
    // console.log(credid)

    // const transaction = await contract.verifyCred(
    //   credid,
    //   fullProof.publicSignals.merkleRoot,
    //   signal,
    //   fullProof.publicSignals.nullifierHash,
    //   credid,
    //   solidityProof,
    //   {
    //     gasLimit: 1000000000,
    //   }
    // );

    setVerified(true);
  };

  return (
    <Container component="main">
      <Card style={{marginTop:"2%"}}>
        <CardContent>
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {verified &&
            <img  style={{width:"20%"}} src ="https://img.freepik.com/premium-vector/verified-square-grunge-checkmark-icon-vector-stock-illustration_100456-9344.jpg?w=2000"></img>
          }
          
          {!verified &&
          <Grid container spacing={2}>
          <Grid item xl={4} lg={4}  md={6} sm={12} xs={12}>
            <Button variant="outlined" onClick={handleClickOpen}>
              Verify Cred
            </Button>
          </Grid>
        </Grid>
          }
          </Box>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose} >
        <DialogContent>
          <Button
                  style={{
                    width: "400px",
                    height: "40px",
                    marginTop: "1%",
                    backgroundColor: "#41DCF5",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                  }}
                  onClick={onScanFile}
                >
                Let's Authenticate your Identity
              </Button>
              
              <br/>
              <br/>
              <QrReader
                ref={qrRef}
                delay={300}
                style={{ width: "100%" }}
                onError={handleErrorFile}
                onScan={handleScanFile}
                legacyMode
              />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default ExampleVerifyCred;
