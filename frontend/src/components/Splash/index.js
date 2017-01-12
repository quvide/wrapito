import React, { Component } from 'react';
import "./style.css";

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <form>
        <select>
          <option value="euw">EUW</option>
          <option value="eune">EUNE</option>
        </select>
        <input type="text"/>
        <input type="submit"/>
      </form>
    );
  }
}

export default Splash;
