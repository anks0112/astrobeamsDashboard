import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

export default function BlogLayout({ title, body, image }) {
  return (
    <Container sx={{ py: 4, minHeight: "90vh", width: "100%" }}>
      {/* Left Section (Main Content - Larger) */}
      <Grid item xs={12} md={9}>
        <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            {title || "Blog Title"}
          </Typography>

          {image && (
            <Box
              component="img"
              src={image}
              alt="Blog Image"
              sx={{
                maxWidth: "100%", // ✅ Ensures it doesn't exceed container width
                height: "auto", // ✅ Maintains original aspect ratio
                borderRadius: 2,
                mb: 2,
                display: "block", // ✅ Prevents extra space below images
                mx: "auto", // ✅ Centers image horizontally
                objectFit: "contain", // ✅ Ensures whole image is visible
              }}
            />
          )}

          {/* Render HTML content properly */}
          <Typography
            variant="body1"
            sx={{ color: "text.secondary" }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Paper>
      </Grid>
    </Container>
  );
}
