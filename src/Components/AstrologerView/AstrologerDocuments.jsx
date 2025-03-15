import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Modal,
  Stack,
} from "@mui/material";

const AstrologerDocuments = ({ astrologer }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box
      sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#FEF2E7", mt: 2 }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        {astrologer.aadhar && (
          <Card sx={{ width: 300, bgcolor: "#FEF2E7" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                Aadhar
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              height="150"
              image={astrologer.aadhar}
              alt="Aadhar Document"
              sx={{ objectFit: "cover", cursor: "pointer" }}
              onClick={() => handleOpen(astrologer.aadhar)}
            />
          </Card>
        )}

        {astrologer.pan && (
          <Card sx={{ width: 300, bgcolor: "#FEF2E7" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                PAN
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              height="150"
              image={astrologer.pan}
              alt="PAN Document"
              sx={{ objectFit: "cover", cursor: "pointer" }}
              onClick={() => handleOpen(astrologer.pan)}
            />
          </Card>
        )}

        {astrologer.passbook_photo &&
          astrologer.passbook_photo.trim() !== "" && (
            <Card sx={{ width: 300, bgcolor: "#FEF2E7" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  Passbook
                </Typography>
              </CardContent>
              <CardMedia
                component="img"
                height="150"
                image={astrologer.passbook_photo}
                alt="Passbook Document"
                sx={{ objectFit: "cover", cursor: "pointer" }}
                onClick={() => handleOpen(astrologer.passbook_photo)}
              />
            </Card>
          )}
      </Stack>

      {/* Modal for image preview */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            maxWidth: "80%",
            maxHeight: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Document Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AstrologerDocuments;
