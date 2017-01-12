import React, { Component } from 'react';
import "./style.css";

class Player extends Component {
  render() {
    const player = this.props.player;
    const leagues = this.props.leagueData;

    let league = null;
    for (const league_ of leagues) {
      if (league_.queue === "RANKED_SOLO_5x5") {
        league = league_;
      }
    }

    let rank = null;
    if (league) {
      if (league.tier !== "CHALLENGER") {
        rank = `${league.tier} ${league.entries[0].division} (${league.entries[0].leaguePoints})`;
      } else {
        rank = `${league.tier} (${league.entries[0].leaguePoints})`
      }
    } else {
      rank = "UNRANKED"
    }

    return (
      <div className="Player">
        {player.summonerName} // {rank}
      </div>
    );
  }
}

class Team extends Component {
  render() {
    return (
      <div className={"Team team-" + this.props.type}>
        {this.props.players.map((player) => {
          return <Player player={player} leagueData={this.props.playerLeagues[player.summonerId] || []} key={player.summonerId} />;
        })}
      </div>
    );
  }
}

class LiveGame extends Component {
  render() {
    const players = this.props.liveGame.participants;
    const teamBlue = players.filter((player) => { return player.teamId === 100 });
    const teamRed = players.filter((player) => { return player.teamId === 200 });

    return (
      <div className="LiveGame">
       <Team type="blue" players={teamBlue} playerLeagues={this.props.playerLeagues} />
       <Team type="red" players={teamRed} playerLeagues={this.props.playerLeagues} />
      </div>
    );
  }
}

export default LiveGame;
