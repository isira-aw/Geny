import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateUISettings } from "./firebase/UIsettingsData";

export const SettingsPage: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    A1: "",
    A2: "",
    A3: "",
    A4: "",
    A5: "",
    A6: "",
    A7: "",
    A8: "",
    A9: "",
    A10: "",
    A11: "",
    A12: "",
    A13: "",
    A14: "",
    A15: "",
  });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!token) throw new Error("No auth token found");
        console.log("Fetching settings with token:", token);
        const res = await fetch("http://localhost:8088/ui/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.status) {
          setForm((prev) => ({ ...prev, ...data.data }));
        }
        if (data.status) {
          setForm((prev) => ({ ...prev, ...data.data }));
          updateUISettings(data.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("http://localhost:8088/ui/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((data) => {
          setForm((prev) => ({ ...prev, ...data.data }));
          updateUISettings(data.data);
        });
      alert("✅ Settings submitted successfully");
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gradient-to-br from-[#98A1BC] via-[#DED3C4] to-[#F4EBD3]  ">
      <div className="flex justify-between p-4 items-center">
        <Typography variant="h6" className="font-bold">
          Settings Configuration
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <Box className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Answer A1"
            name="A1"
            value={form.A1}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A2"
            name="A2"
            value={form.A2}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A3"
            name="A3"
            value={form.A3}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A4"
            name="A4"
            value={form.A4}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A5"
            name="A5"
            value={form.A5}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A6"
            name="A6"
            value={form.A6}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A7"
            name="A7"
            value={form.A7}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A8"
            name="A8"
            value={form.A8}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A9"
            name="A9"
            value={form.A9}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A10"
            name="A10"
            value={form.A10}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A11"
            name="A11"
            value={form.A11}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A12"
            name="A12"
            value={form.A12}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A13"
            name="A13"
            value={form.A13}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A14"
            name="A14"
            value={form.A14}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Answer A15"
            name="A15"
            value={form.A15}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      )}

      <div className="p-6 border-t flex justify-end">
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};
