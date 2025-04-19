import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { logout, setCredentials } from "./store/authSlice";
import { isLoggedIn } from "./utils/isLoggedIn";
function App() {
  const dispatch = useDispatch();

  const checkLoggedIn = () => {
    const { token, login } = isLoggedIn();
    if (login && token) {
      dispatch(setCredentials({ token }));
    } else {
      dispatch(logout());
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
