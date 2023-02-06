import React, { useState, useEffect, useRef } from "react";
import { NFTStorage } from "nft.storage";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../../assets/logo.jpeg";
import {
  EXAMPLE_ISSUER_ADDRESS,
  EXAMPLE_ISSUER_ABI,
} from "../../CredsProtocolConstants.js";
import { ethers } from "ethers";

const theme = createTheme();

function Upload() {
  const inputFilePropertyRef = useRef(null);
  const [propertyImage, setPropertyImage] = useState(null);
  const [CredName, setCredName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  function inputPropertyImageHandler(e) {
    inputFilePropertyRef.current.click();
    console.log(e.target.files[0]);
    setPropertyImage(e.target.files[0]);
  }

  async function IPFSupload(data, file) {
    try {

      const client = new NFTStorage({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEYxMjRGNzViYzgwMWE1MmVENTkxQzRBNjVkRWVjMEUxMkVjZTgxRGEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NDEzMDQ4NzAyMiwibmFtZSI6IjNFc3RhdGVzIn0.6GtIH1dEXlOzT4YyTdTQaltFLtuMhn5fWLZrPZ_xthY",
      });
      console.log(new File([file], file.name, { type: file.type }));
      console.log(data);
      const metadata = await client.store({
        name: data.name,
        description: data.description,
        image: new File([file], file.name, { type: file.type }),
      });
      console.log(metadata);
      return metadata.url;
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Uploaded on IPFS")
    }
  }

  const uploadMetadata = async (name, description, image) => {
    console.log("== Uploading Metadata == ");
    console.log(name);
    console.log(description);
    console.log(image);
    const metadataUrl = await IPFSupload(
      {
        name: name,
        description: description,
      },
      image
    );
    console.log(metadataUrl);

    return metadataUrl;
  };

  const listNFT = async (event) => {
    setLoading(true);
    event.preventDefault();
    let uri = await uploadMetadata(CredName, description, propertyImage);
    uri = "https://ipfs.io/ipfs/" + uri.slice(7);

    console.log("Token URI : ", uri);
    // INTEGRATE CONTRACT HERE
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const address = await signer.getAddress();

    const contract = new ethers.Contract(
      EXAMPLE_ISSUER_ADDRESS,
      EXAMPLE_ISSUER_ABI,
      signer
    );

    console.log(contract)

    let tx = await contract.issueCred(20,0, address, uri, {
      gasLimit: 1000000000, // BlockGasLimit / 10
    });

    console.log(tx)
    setLoading(false);

  };

  if (loading) {
    return (
      <img
        style={{ marginTop: "2%", marginLeft: "10%", width: "80%" }}
        src="https://icon-library.com/images/gif-loading-icon/gif-loading-icon-10.jpg"
      />
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <br />
        <Grid container component="main" sx={{ height: "80vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage:
                "url(https://i.pinimg.com/originals/0e/47/72/0e47720e157806d45d45c736fb2fa920.gif)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
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
                src={Logo}
              ></img>
              <Typography component="h1" variant="h5">
                Cred Details
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={listNFT}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="credName"
                  label="Cred Name"
                  name="credName"
                  autoFocus
                  onChange={(e) => setCredName(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="description"
                  label="Cred Description"
                  type="text"
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input
                    ref={inputFilePropertyRef}
                    type="file"
                    id="icon-button-file"
                    hidden
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    onChange={(e) => inputPropertyImageHandler(e)}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      style={{
                        marginTop:"35%"
                      }}
                    >
                      <AddAPhotoIcon />
                    </IconButton>
                  </label>
                </div>
                <button
                  type="submit"
                  style={{
                    width: "400px",
                    height: "40px",
                    marginTop: "6%",
                    backgroundColor: "#41DCF5",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                  }}
                >
                  Generate Cred
                </button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }
}

export default Upload;
