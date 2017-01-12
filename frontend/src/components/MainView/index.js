import React, { Component } from "react";

import ProfileInfo from "./ProfileInfo";
import ProfileRank from "./ProfileRank";
import LiveGame from "./LiveGame";
import MatchHistory from "./MatchHistory";

import RiotAPI from "./RiotAPI";

import "./style.css";

class Loading extends Component {
  render() {
    return (<div className="Loading">Loading {this.props.what}...</div>);
  }
}

class MainView extends Component {
  constructor(props) {
    super(props);

    this.state = { staticData: {} };

    this.region = props.params.region;
    this.RiotAPI = new RiotAPI(this.region);
    this.name = this.RiotAPI.normalizedSummonerName(props.params.name);
  }

  componentDidMount() {
    this.RiotAPI.summonerObject((response) => {
      this.setState({ summonerObject: response[this.name] });
      if (!this.state.summonerObject) {
        // summoner probably doesn't exist
      }

      this.RiotAPI.summonerLeague((response) => {
        this.setState({ summonerLeague: response[this.state.summonerObject.id] });
      }, this.state.summonerObject.id);

      this.RiotAPI.matchHistory((response) => {
        this.setState({ matchHistory: response });
      }, this.state.summonerObject.id);

      this.RiotAPI.liveGame((response) => {
        this.setState({ liveGame: response });

        const players = this.state.liveGame.participants.map((player) => {
          return player.summonerId;
        });

        this.RiotAPI.summonerLeague((response) => {
          this.setState({ liveGamePlayers: response });
        }, players);
      }, this.state.summonerObject.id);

    }, this.name);

    this.RiotAPI.staticChampions((response) => {
      this.setState({ staticChampions: response.data });
    });

    this.RiotAPI.staticItems((response) => {
      this.setState({ staticItems: response.data });
    });

    this.RiotAPI.staticSummonerSpells((response) => {
      this.setState({ staticSummonerSpells: response.data });
    });
  }

  render() {
    let loaded = [];
    if (this.state.summonerObject) {
      loaded.push(<ProfileInfo summonerObject={this.state.summonerObject} key="ProfileInfo" />);
      loaded.push(<ProfileRank league={this.state.summonerLeague} key="ProfileRank" />);
    } else {
      loaded.push(<Loading what="Profile" key="LoadingProfile"/>);
    }


    if (this.state.staticChampions && this.state.staticSummonerSpells && this.state.staticItems && this.state.matchHistory) {
      const staticData = {
        spells: this.state.staticSummonerSpells,
        items: this.state.staticItems,
        champions: this.state.staticChampions
      }
      if (this.state.liveGame && this.state.liveGamePlayers) {
        loaded.push(<LiveGame staticData={staticData} liveGame={this.state.liveGame} playerLeagues={this.state.liveGamePlayers} key="LiveGame" />);
      } // we don't want a loading if the player's not in a game

      loaded.push(<MatchHistory staticData={staticData} matchHistory={this.state.matchHistory} key="MatchHistory" />);
    } else {
      loaded.push(<Loading what="History" key="LoadingHistory" />);
    }

    return (
      <div className="MainView">
        {loaded}

        <div className="Disclaimer">
          <p>This site isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.</p>
        </div>
      </div>
    )
  }
}

export default MainView;
