import { Cancel } from "@mui/icons-material";
import CropIcon from "@mui/icons-material/Crop";
import { Box, Button, DialogActions, DialogContent, Slider, Typography } from "@mui/material";
import React, { useState } from "react";
import Cropper from "react-easy-crop";

import getCroppedImg from "./utils/cropImage";
import "./crops.css";

const CropEasy = ({
  photoURL,
  setOpenCrop,
  setPhotoURL,
  setFile,
  hideModal,
  setRealPhotoURL,
  realPhotoURL,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCancel = () => {
    hideModal();
    setRealPhotoURL(realPhotoURL);
  };

  const cropImage = async () => {
    try {
      const { file, url } = await getCroppedImg(photoURL, croppedAreaPixels, rotation);

      setPhotoURL(url);
      setRealPhotoURL(url);
      setFile(file);
      setOpenCrop(false);
      hideModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <DialogContent
        dividers
        sx={{
          background: "#333",
          position: "relative",
          height: 400,
          width: "auto",
          minWidth: { sm: 500 },
        }}
      >
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
          cropSize={{ width: 183, height: 183 }}
        />
      </DialogContent>

      <DialogActions sx={{ flexDirection: "column", mx: 3, my: 2 }}>
        <Box sx={{ width: "100%", mb: 1 }}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider
              valueLabelDisplay="auto"
              valueLabelFormat={zoomPercent}
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </Box>
          <Box>
            <Typography>Rotation: {rotation + "°"}</Typography>
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={360}
              value={rotation}
              onChange={(e, rotation) => setRotation(rotation)}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={<CropIcon />} onClick={cropImage}>
            Crop
          </Button>
        </Box>
      </DialogActions>
    </>
  );
};

export default CropEasy;

const zoomPercent = value => {
  return `${Math.round(value * 100)}%`;
};
