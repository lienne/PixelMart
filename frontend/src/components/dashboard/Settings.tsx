import { useContext, useState } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { useAuth0 } from "@auth0/auth0-react";
import { ProfileContext } from "../../context/ProfileContext";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Settings() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { user, logout, getAccessTokenSilently } = useAuth0();
    const { profile, setProfile } = useContext(ProfileContext);
    const [name, setName] = useState(profile?.name || "Jane Doe");
    const [username, setUsername] = useState(profile?.username || "");
    const [usernameAvailableMsg, setUsernameAvailableMsg] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || '');
    const [message, setMessage] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [showDeletedPopup, setShowDeletedPopup] = useState(false);

    const checkUsernameAvailability = async () => {
        if (!username.trim()) {
            setUsernameAvailableMsg('Please enter a username.');
            return;
        }

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/users/username-availability/${encodeURIComponent(username)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            const data = await response.json();

            if (data.available) {
                setUsernameAvailableMsg('Username is available!');
            } else {
                setUsernameAvailableMsg('This username is already taken.');
            }
        } catch (err) {
            console.error('Error checking username availability:', err);
            setUsernameAvailableMsg('Error checking username.');
        }
    };

    const handleSave = async () => {
        if (!user?.sub) {
            setMessage('User not authenticated.');
            return;
        }

        try {
            const token = await getAccessTokenSilently();
            console.log("Token: ", token);
            const auth0Id = user.sub;
            const response = await fetch(`${API_BASE_URL}/users/profile/update/${auth0Id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, avatar: avatarUrl, username })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile.');
            }

            const data = await response.json();
            setMessage('Profile updated successfully!');
            console.log('Updated user:', data.user);
            setProfile(data.user);
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setMessage(err.message || 'Error updating profile.');
        }
    };

    const handleDeleteAccount = () => {
        setOpenDialog(true);
    };

    const handleCloseSuccessDialog = () => {
        setShowDeletedPopup(false);
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    const confirmDeleteaccount = async () => {
        if (!user?.sub) {
            console.error("User not authenticated.");
            return;
        }

        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/users/delete/${user.sub}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.ok) {
                setOpenDialog(false);
                setShowDeletedPopup(true);
            } else {
                throw new Error("Failed to delete account.");
            }
            
            setOpenDialog(false);
            setShowDeletedPopup(true);

            // Logout the user after account deletion
            logout({ logoutParams: { returnTo: window.location.origin } });
        } catch (err) {
            console.error("Error deleting account:", err);
            toast.error("An error occurred while deleting your account.", {
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    };

    const cancelDeleteAccount = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
            
            <Typography variant="h4" gutterBottom>
                Account Settings
            </Typography>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Account Information */}
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={user?.email || ""}
                  disabled
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Username"
                      variant="outlined"
                      fullWidth
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setUsernameAvailableMsg(''); }}
                      placeholder="Choose a unique username"
                    />
                    <Button variant="outlined" onClick={checkUsernameAvailability}>Check</Button>
                </Box>
                {usernameAvailableMsg && <Typography variant="body2">{usernameAvailableMsg}</Typography>}

                <TextField
                  label="Avatar URL"
                  variant="outlined"
                  fullWidth
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://i.pinimg.com/736x/1b/2e/31/1b2e314e767a957a44ed8f992c6d9098.jpg"
                />

                {/* Basic Preferences */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable Email Notifications"
                />

                {/* Save Button */}
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save Settings
                </Button>
                {message && <Typography variant="body2">{message}</Typography>}

                {/* Delete Account Button */}
                <Button variant="contained" color="error" onClick={handleDeleteAccount} sx={{ mt: 4 }}>
                    Delete Account
                </Button>
            </Box>

            {/* Confirmation Dialog for Account Deletion */}
            <Dialog open={openDialog} onClose={cancelDeleteAccount}>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDeleteAccount} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteaccount} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Dialog for Account Deletion */}
            {showDeletedPopup && (
            <Dialog open={showDeletedPopup} onClose={handleCloseSuccessDialog}>
                <DialogTitle>Account Deleted</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your account has been deleted successfully. You will now be redirected to the homepage.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccessDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        )}
        </Container>
    );
}

export default Settings;