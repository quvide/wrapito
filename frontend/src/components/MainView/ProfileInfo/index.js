import React, { Component } from "react";

import "./style.css"

class ProfileIcon extends Component {
  getImage() {
    return "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/" + this.props.id + ".png";
  }

  render() {
    return (
      <div className="ProfileIcon">
        <img src={this.getImage()} alt="Profile icon" className="profile-icon-big"/>
        <div className="profile-icon-level">{this.props.level}</div>
      </div>
    );
  }
}

class ProfileName extends Component {
  render() {
    return (
      <span className="summoner-name summoner-big">{this.props.name}</span>
    );
  }
}

class ProfileInfo extends Component {
  render() {
    const summoner = this.props.summonerObject;
    return (
      <div className="ProfileInfo">
        <ProfileIcon id={summoner.profileIconId} level={summoner.summonerLevel} />
        <div className="ProfileMeta">
          <ProfileName id={summoner.id} name={summoner.name} />
        </div>
      </div>
    );
  }
}

export default ProfileInfo;
