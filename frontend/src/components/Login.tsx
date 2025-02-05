// import React, { useContext, useState } from 'react';
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Link as MuiLink
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { loginUser, registerUser } from '../api/auth';

// function Auth() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { setIsAuthenticated } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setErrorMessage('');
//     setLoading(true);

//     // For sign-up, ensure passwords match
//     if (!isLogin && password !== confirmPassword) {
//       setErrorMessage('Passwords do not match.');
//       setLoading(false);
//       return;
//     }

//     try {
//       if (isLogin) {
//         // Call login API
//         const data = await loginUser(email, password);
//         console.log('Logged in:', data.user);
//         console.log('Token:', data.token);
//         localStorage.setItem('token', data.token);
//         setIsAuthenticated(true);
//       } else {
//         // Call registration API
//         const data = await registerUser(email, password);
//         console.log('Signed up:', data.user);
//         console.log('Token:', data.token);
//         localStorage.setItem('token', data.token);
//         setIsAuthenticated(true);
//       }
//       navigate('/dashboard');
//     } catch (err: any) {
//       setError(err.message || 'An error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleAuthMode = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsLogin(!isLogin);
//     setErrorMessage('');
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4 }}>
//       <Box
//         sx={{
//           p: 4,
//           boxShadow: 3,
//           borderRadius: 2,
//           bgcolor: 'background.paper',
//         }}
//       >
//         <Typography variant="h4" align="center" gutterBottom>
//           {isLogin ? 'Login' : 'Sign Up'}
//         </Typography>
//         {error && (
//           <Typography variant="body1" color="error" align="center">
//             {error}
//           </Typography>
//         )}
//         {errorMessage && (
//           <Typography variant="body1" color="error" align="center">
//             {errorMessage}
//           </Typography>
//         )}
//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//           <TextField
//             fullWidth
//             required
//             label="Email"
//             type="email"
//             variant="outlined"
//             margin="normal"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <TextField
//             fullWidth
//             required
//             label="Password"
//             type="password"
//             variant="outlined"
//             margin="normal"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           {!isLogin && (
//             <TextField
//               fullWidth
//               required
//               label="Confirm Password"
//               type="password"
//               variant="outlined"
//               margin="normal"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//           )}
//           <Button
//             fullWidth
//             type="submit"
//             variant="contained"
//             color="primary"
//             disabled={loading}
//             sx={{ mt: 2 }}
//           >
//             {loading
//               ? isLogin
//                 ? 'Logging in...'
//                 : 'Signing up...'
//               : isLogin
//               ? 'Login'
//               : 'Sign Up'}
//           </Button>
//         </Box>
//         <Box sx={{ mt: 2, textAlign: 'center' }}>
//           <MuiLink href="#" onClick={toggleAuthMode} underline="hover">
//             {isLogin
//               ? "Don't have an account? Sign up"
//               : "Already have an account? Login"}
//           </MuiLink>
//         </Box>
//       </Box>
//     </Container>
//   );
// }

// export default Auth;

// import { useEffect } from "react";
// import Auth0Lock from 'auth0-lock';

// function Login() {
//     useEffect(() => {
//         const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
//         const domain = import.meta.env.VITE_AUTH0_DOMAIN;

//         const lock = new Auth0Lock(
//             clientId,
//             domain,
//             {
//                 container: 'auth0-lock-container',
//                 auth: {
//                     redirectUrl: window.location.origin,
//                     responseType: 'token id_token',
//                     audience: `https://${domain}/userinfo`,
//                     params: {
//                         scope: 'openid profile email'
//                     }
//                 },
//                 theme: {
//                     primaryColor: '#007bff',
//                     logo: ''
//                 },
//                 languageDictionary: {
//                     title: 'PixelMart'
//                 }
//             }
//         );

//         // Listen for the authenticated event
//         lock.on('authenticated', (authResult) => {
//             // Retrieve user information using the access token
//             lock.getUserInfo(authResult.accessToken, (error, profile) => {
//                 if (error) {
//                     console.error('Error loading the user profile', error);
//                     return;
//                 }
//                 console.log('User authenticated:', profile);
//             });
//         });

//         // Display the lock widget
//         lock.show();

//         // Cleanup: hide the widget on unmount
//         return () => {
//             lock.hide();
//         };
//     }, []);

//     return <div id="auth0-lock-container" />;
// };

// export default Login;