import { jwtDecode } from 'jwt-decode';

export const isLoggedIn = () => {
  const token = localStorage.getItem('token');

  if (!token) return false;

  try {
    const decoded = jwtDecode(token); // expects { id, name, role, exp }

    // Check for expiration
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {

      localStorage.removeItem('token'); // token is expired
      return { token: null , login : false };
    }

    // Valid token
    return { token, login: true };
  } catch (err) {
    localStorage.removeItem('token'); // invalid token
    return false;
  }
};
