import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { createAstrologer } from "../../redux/slices/createAstrologer";
import { astrologerSchema } from "../../utils/zodSchema";

const AddAstrologerModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    profile_photo: "",
    gender: "",
    dob: "",
    city: "",
    bio: "",
    experience: "",
    expertise: [],
    language: "",
    featured: "",
    bank_details: { bank_name: "", ifsc: "", account_number: "" }, // JSON object
    voice_call_price: "",
    chat_price: "",
    voice_call_offer_price: "",
    chat_offer_price: "",
    aadhar: "",
    pan: "",
    passbook_photo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      [
        "phone",
        "account_number",
        "experience",
        "voice_call_price",
        "chat_price",
        "voice_call_offer_price",
        "chat_offer_price",
      ].includes(name)
    ) {
      if (!/^\d*$/.test(value)) return; // Prevents non-numeric input
      if (value < 0) return; // Prevents negative numbers
      // if (name === "phone") {
      //   newValue = value.slice(0, 10);
      // }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "dob"
          ? new Date(value)
          : name === "featured"
          ? value === "true"
          : name === "experience"
          ? value.toString()
          : name === "expertise"
          ? value
            ? value.split(",").map((item) => item.trim())
            : [] // ✅ Ensure array
          : value,
    }));
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      bank_details: {
        ...prevData.bank_details,
        [name]: value,
      },
    }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImage = new FormData();
    formDataImage.append("file", file);

    try {
      const response = await api.post("/backend/upload", formDataImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setFormData((prevState) => ({
          ...prevState,
          [fieldName]: response.data.url, // Store image link
        }));
      } else {
        alert("Image upload failed!");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Error uploading image. Please try again.");
    }
  };

  // Remove image
  const handleRemoveImage = (fieldName) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedPhone =
      formData.phone.length === 10 ? `+91${formData.phone}` : "";

    const requestData = {
      ...formData,
      phone: formattedPhone, // ✅ Ensures +91 before sending
    };

    console.log("✅ Valid Data:", requestData);
    dispatch(createAstrologer(requestData));
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={styles.modalBox}>
        <Typography variant="h5" sx={styles.heading}>
          Add Astrologer
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <Typography variant="h6" sx={styles.sectionHeading}>
            Personal Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric input
                  if (value.length <= 10) {
                    handleChange(e); // Pass only valid numbers
                  }
                }}
                required
                inputProps={{
                  maxLength: 10, // Limits input to 10 characters
                }}
                // type="number" // ✅ Ensures numeric input
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                required
                select
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                name="dob"
                value={
                  formData.dob
                    ? new Date(formData.dob).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              multiline // Enables multiple lines
              minRows={4} // Increases height
              sx={{
                mt: 2,
                "& .MuiInputBase-root": { height: "auto", padding: "12px" },
              }} // Adjusts styling
            />
          </Grid>

          <Typography variant="h6" sx={styles.sectionHeading}>
            Bank Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bank_name"
                value={formData.bank_details.bank_name}
                onChange={handleBankDetailsChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="ifsc"
                value={formData.bank_details.ifsc}
                onChange={handleBankDetailsChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Account Number"
                name="account_number"
                value={formData.bank_details.account_number}
                onChange={handleBankDetailsChange}
                required
                type="number" // Ensures only numeric input
                inputMode="numeric" // Optimizes mobile keyboard for numbers
                pattern="[0-9]*" // Ensures only numbers are allowed
              />
            </Grid>
          </Grid>

          {/* Work Experience */}
          <Typography variant="h6" sx={{ ...styles.sectionHeading, mt: 2 }}>
            Work Experience
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Experience (Years)"
                name="experience"
                type="text" // ✅ Change to text, as backend expects a string
                value={formData.experience}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0 && value <= 1000) {
                    handleChange(e);
                  }
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expertise (comma separated)"
                name="expertise"
                value={
                  Array.isArray(formData.expertise)
                    ? formData.expertise.join(", ")
                    : ""
                } // ✅ Ensure it’s an array before using .join()
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Languages known"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Featured"
                name="featured"
                value={formData.featured ? "true" : "false"}
                onChange={handleChange}
                required
                select
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Pricing */}
          <Typography variant="h6" sx={styles.sectionHeading}>
            Pricing
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Voice Call Price"
                name="voice_call_price"
                value={formData.voice_call_price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Voice Call Offer Price"
                name="voice_call_offer_price"
                value={formData.voice_call_offer_price}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Chat Price"
                name="chat_price"
                value={formData.chat_price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Chat offer price"
                name="chat_offer_price"
                value={formData.chat_offer_price}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Documents Upload */}
          <Typography variant="h6" sx={styles.sectionHeading}>
            Upload Files
          </Typography>
          {["profile_photo", "aadhar", "pan", "passbook_photo"].map((field) => (
            <Grid item xs={12} key={field}>
              {formData[field] && (
                <>
                  <a
                    href={formData[field]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={formData[field]}
                      alt={field}
                      style={styles.imagePreview}
                    />
                  </a>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleRemoveImage(field)}
                  >
                    Remove
                  </Button>
                </>
              )}
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2, mb: 2, backgroundColor: "#ff9800" }}
              >
                Upload {field.replace("_", " ").toUpperCase()}
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileUpload(e, field)}
                />
              </Button>
            </Grid>
          ))}

          {/* Submit Button */}
          <Box sx={styles.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#ff9800" }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

// Styles
const styles = {
  modalBox: {
    maxHeight: "90vh",
    overflowY: "auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 800,
    bgcolor: "background.paper",
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
  },
  sectionHeading: {
    marginBottom: "20px",
    marginTop: "20px",
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100px",
    height: "100px",
    marginTop: "10px",
    borderRadius: "8px",
    display: "block",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    marginTop: 4,
  },
};

export default AddAstrologerModal;
