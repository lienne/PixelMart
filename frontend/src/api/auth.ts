// const API_BASE_URL = 'http://localhost:3000/api/auth';

// export const registerUser = async (email: string, password: string) => {
//     const response = await fetch(`${API_BASE_URL}/signup`, {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Registration failed');
//     }

//     return await response.json(); // Expecting { user, token }
// };

// export const loginUser = async (email: string, password: string) => {
//     const response = await fetch(`${API_BASE_URL}/login`, {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Login failed');
//     }

//     return await response.json(); // Expecting { user, token }
// };