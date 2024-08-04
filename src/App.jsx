
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./pages/Home";
import About from "./pages/About";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import User from "./pages/User";

import Login from "./pages/Login";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route
            path="/students"
            element={
              isLoggedIn ? (
                <Students students={students} setStudents={setStudents} />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route
            path="/teachers"
            element={
              isLoggedIn ? (
                <Teachers />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />{" "}
          <Route path="/user" component={User} />
          <Route path="/admin" component={AdminPanel} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
