import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./pages/Home";
import About from "./pages/About";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import User from "./pages/User";
import Login from "./pages/Login";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import Navbar from "./components/Navbar";
import { Content } from "antd/es/layout/layout";

const App = () => {
  const [students, setStudents] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Provider store={store}>
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider>
            <Navbar isLoggedIn={isLoggedIn} />
          </Sider>
          <Layout className="site-layout">
            <Content style={{ margin: "16px" }}>
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
                <Route
                  path="/login"
                  element={<Login setIsLoggedIn={setIsLoggedIn} />}
                />
              </Routes>{" "}
            </Content>
          </Layout>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
