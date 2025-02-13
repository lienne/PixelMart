// import { createContext, useState, useEffect, ReactNode } from 'react';

// interface AuthContextType {
//     isAuthenticated: boolean;
//     setIsAuthenticated: (auth: boolean) => void;
// }

// export const AuthContext = createContext<AuthContextType>({
//     isAuthenticated: false,
//     setIsAuthenticated: () => {},
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         setIsAuthenticated(!!token);
//     }, []);

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };