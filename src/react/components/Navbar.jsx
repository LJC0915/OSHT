import React from "react";

import "./Navbar.css";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="Navbar text-center">
        <h1 className="p-2">Omaha Starting Hand Trainer</h1>
      </div>
    );
  }
}
