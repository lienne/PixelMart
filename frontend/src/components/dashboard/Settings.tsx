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
    const { profile, setProfile } = useContext(ProfileContext);
    const [name, setName] = useState(profile?.name || "Jane Doe");
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || '');
    const [message, setMessage] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const { user } = useAuth0();

    const handleSave = async () => {
        if (!user?.sub) {
            setMessage('User not authenticated.');
            return;
        }

        try {
            const auth0Id = user?.sub;
            const response = await fetch(`http://localhost:3000/api/users/profile/${auth0Id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, avatar: avatarUrl })
            });
            if (!response.ok) {
                throw new Error('Failed to update profile.');
            }
            const data = await response.json();
            setMessage('Profile updated successfully!');
            console.log('Updated user:', data.user);
            setProfile(data.user);
        } catch (err) {
            console.error('Error updating profile:', err);
            setMessage('Error updating profile.');
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
                 value="jane.doe@example.com"
                 disabled
                />
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