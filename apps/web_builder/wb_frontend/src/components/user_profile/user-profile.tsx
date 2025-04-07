import React, { useState, useEffect } from "react";
import {
  Typography, Paper, CircularProgress, Button, TextField, Snackbar, Box
} from "@mui/material";
import { useParams } from "react-router-dom";
import { callGetAPI, callPutAPI } from "../../api_utils";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Helmet } from 'react-helmet-async';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const UserProfile: React.FC = () => {
  const { t } = useTranslation('translation');
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ oldPassword: string; newPassword: string; confirmNewPassword: string }>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      try {
        const response = await callGetAPI(`/profile/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveError("");
    setSuccessMessage("");

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setSaveError("All password fields are required.");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setSaveError(t("user_profile.new_passwords_do_not_match."));
      setLoading(false);
      return;
    }

    try {
      await callPutAPI(`/profile/${userId}`, formData);
      setSuccessMessage(t("user_profile.password_updated_successfully"));
      setOpenSnackbar(true);
      setEditing(false);

      // ✅ Reset form về trống sau khi đổi mật khẩu thành công
      setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      setSaveError(t("user_profile.failed_to_update_password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Helmet component to manage SEO */}
      <Helmet>
        <title>{editing ? t("user_profile.change_password") : t("user_profile.user_profile")}</title>
        <meta name="description" content="T" />
      </Helmet>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          overflow: "hidden",
          backgroundImage: "url(https://source.unsplash.com/1600x900/?technology,nature)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: 2
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 6,
            maxWidth: 500,
            width: "100%",
            textAlign: "center",
            borderRadius: 4,
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.85)",
            position: "relative"
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: "#333" }}>
            {editing ? (
              <>
                <LockIcon sx={{ fontSize: 50, verticalAlign: 'middle', marginRight: 1 }} />
                {t("user_profile.change_password")}
              </>
            ) : (
              <>
                <AccountCircleIcon sx={{ fontSize: 50, verticalAlign: 'middle', marginRight: 1 }} />
                {t("user_profile.user_profile")}
              </>
            )}
          </Typography>

          {loading && <CircularProgress sx={{ marginBottom: 3 }} />}

          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && user && !editing && (
            <>
              <Typography variant="h5" gutterBottom sx={{ color: "#555" }}>
                {user.username}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: "#888" }}>
                {t("user_profile.password")}: ********
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  background: "linear-gradient(135deg, #667eea 30%, #764ba2 90%)",
                  "&:hover": { background: "linear-gradient(135deg, #5a67d8 30%, #6b44a2 90%)" }
                }}
                onClick={() => {
                  setEditing(true);
                  setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" }); // ✅ Reset form khi mở lại Change Password
                }}
              >
                {t("user_profile.change_password")}
              </Button>
            </>
          )}

          {editing && !loading && !error && user && (
            <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
              {saveError && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  {saveError}
                </Alert>
              )}

              <TextField
                label={t("user_profile.old_password")}
                variant="outlined"
                fullWidth
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleChange}
                sx={{ marginBottom: 3 }}
              />

              <TextField
                label={t("user_profile.new_password")}
                variant="outlined"
                fullWidth
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                sx={{ marginBottom: 3 }}
              />

              <TextField
                label={t("user_profile.confirm_new_password")}
                variant="outlined"
                fullWidth
                name="confirmNewPassword"
                type="password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                sx={{ marginBottom: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  background: "linear-gradient(135deg, #ff6a00 30%, #ee0979 90%)",
                  "&:hover": { background: "linear-gradient(135deg, #e65c00 30%, #d9077e 90%)" }
                }}
              >
                {t("user_profile.save")}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                color="secondary"
                sx={{ mt: 2 }}
                onClick={() => {
                  setEditing(false);
                  setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" }); // ✅ Reset form khi bấm Cancel
                }}
              >
                {t("user_profile.cancel")}
              </Button>
            </form>
          )}
        </Paper>

        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert onClose={() => setOpenSnackbar(false)} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};
