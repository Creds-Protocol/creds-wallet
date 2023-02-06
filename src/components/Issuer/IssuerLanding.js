import React, { useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  CREDS_PROTOCOL_REGISTRY_ADDRESS,
  CREDS_PROTOCOL_REGISTRY_ABI,
} from "../../CredsProtocolConstants.js";
import Issuer from "../../assets/issuer.jpeg";
const theme = createTheme();

export default function IssuerLanding() {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [notregistered, setNotRegistered] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data);
    try {
      const message =
        "Welcome to Creds Protocol ! You are all set to become an issuer";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      const address = await signer.getAddress();
      console.log({
        address: address,
        name: data.get("name"),
        contract: data.get("contract"),
        signature: signature,
      });

      const contract = new ethers.Contract(
        CREDS_PROTOCOL_REGISTRY_ADDRESS,
        CREDS_PROTOCOL_REGISTRY_ABI,
        provider
      );
      console.log(contract);

      const isIssuerRegistered = await contract.isRegisteredIssuer(address);
      console.log(address);
      console.log(isIssuerRegistered);
      setRegistered(isIssuerRegistered);
      if (registered) {
        navigate("/issuer/issuecred/" + address);
      } else {
        setNotRegistered(true);
        console.log("hello");
        navigate("/issuer/404");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const message =
        "Welcome to Creds Protocol ! You are all set to become an issuer";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      const address = await signer.getAddress();

      const contract = new ethers.Contract(
        CREDS_PROTOCOL_REGISTRY_ADDRESS,
        CREDS_PROTOCOL_REGISTRY_ABI,
        provider
      );
      console.log(contract);

      const isIssuerRegistered = await contract.isRegisteredIssuer(address);
      setRegistered(isIssuerRegistered);
      console.log(address);
      console.log(isIssuerRegistered);
      setRegistered(isIssuerRegistered);
      if (isIssuerRegistered) {
        navigate("/issuer/issuecred/" + address);
      } else {
        setNotRegistered(true);
        console.log("hello");
        navigate("/issuer/404");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "91vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://assets.isu.pub/document-structure/230125115559-965bf85668e292dd23252b41768bf7c2/v1/f9b62eb9dee7835f860015a3c321c22a.jpeg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          {!notregistered ? (
            <>
              {" "}
              {registered ? (
                <>
                  <Box
                    sx={{
                      my: 8,
                      mx: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                      <AccountBalanceIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                      Issuer Organisation
                    </Typography>
                    <Box
                      component="form"
                      noValidate
                      onSubmit={handleSubmit}
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Issuer Name"
                        name="name"
                        autoFocus
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="contract"
                        label="Issuer Contract"
                        id="contract"
                      />
                      <br />
                      <br />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Ready to Issue Creds
                      </Button>
                      <Grid container>
                        <Grid item xs>
                          Hell
                        </Grid>
                        <Grid item>Swarg</Grid>
                      </Grid>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      my: 8,
                      mx: 4,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
              <img
                style={{ width: "25%" }}
                src={Issuer}
              ></img>
              <br/>
              
                    <Typography component="h1" variant="h5">
                      Issuer Organisation
                    </Typography>
                    <img
                      src="https://media3.giphy.com/media/CdvCjn3HEcElzKtqju/giphy.gif?cid=6c09b9527xdeenvrnfkkeaqy811xjry4ebehn3jlol3s7np5&rid=giphy.gif&ct=s"
                      style={{ width: "60%" }}
                      onClick={connectWallet}
                    ></img>
                  </Box>
                </>
              )}
            </>
          ) : (
            <>Deploy Your contract</>
          )}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
