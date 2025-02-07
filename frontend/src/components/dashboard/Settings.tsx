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

function Settings() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { user } = useAuth0();
    const { profile, setProfile } = useContext(ProfileContext);
    const [name, setName] = useState(profile?.name || "Jane Doe");
    const [username, setUsername] = useState(profile?.username || "");
    const [usernameAvailableMsg, setUsernameAvailableMsg] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || '');
    const [message, setMessage] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const checkUsernameAvailability = async () => {
        if (!username.trim()) {
            setUsernameAvailableMsg('Please enter a username.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/username-availability/${encodeURIComponent(username)}`);
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
            const auth0Id = user.sub;
            const response = await fetch(`${API_BASE_URL}/users/profile/${auth0Id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
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

    const confirmDeleteaccount = () => {
        console.log("Account deleted.");
        setOpenDialog(false);
    };

    const cancelDeleteAccount = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
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

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={cancelDeleteAccount}>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be undone.
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
        </Container>
    );
};

export default Settings;