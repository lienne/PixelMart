// import { Request, Response, NextFunction } from 'express';
// import { createUser, findUserByEmail } from '../models/userModel';
// import pool from '../database';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// const saltRounds = 10;

// export const signup = async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         res.status(400).json({ message: 'Email and password are required.' });
//         return;
//     }

//     try {
//         // Check if user already exists
//         const existingUser = await findUserByEmail(email);
//         if (existingUser) {
//             res.status(409).json({ message: 'User already exists.' });
//             return;
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Insert the new user into the database
//         const newUser = await createUser(email, hashedPassword);

//         // Create a JWT token for the new user
//         const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

//         res.status(201).json({ user: newUser, token });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error creating user.' });
//         return;
//     }
// };

// export const login = async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         res.status(400).json({ message: 'Email and password are required.' });
//         return;
//     }

//     try {
//         const user = await findUserByEmail(email);
//         if (!user) {
//             res.status(401).json({ message: 'Invalid email or password.' });
//             return;
//         }

//         // Compare passwords
//         const isValid = await bcrypt.compare(password, user.password);
//         if (!isValid) {
//             res.status(401).json({ message: 'Invalid email or password.' });
//             return;
//         }

//         // Generate a JWT token
//         const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

//         res.status(200).json({ user, token });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error logging in. '});
//         return;
//     }
// };