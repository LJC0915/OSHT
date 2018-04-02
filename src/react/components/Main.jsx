import React from "react";

import Navbar from "components/Navbar.jsx";
import Train from "components/Train.jsx";
import Footer from "components/Footer.jsx";
import "./Main.css";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="d-flex flex-column justify-content-between main">
        <Navbar />
        <Train />
        <Footer />
      </div>
    );
  }
}
