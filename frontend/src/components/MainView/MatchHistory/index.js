import React, { Component } from "react";
import "./style.css";

class ChampionIcon extends Component {
  render() {
    return (
      <div>
        <img className="ChampionIcon" src={`http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/${this.props.path}`} alt="Champion Icon"/>
      </div>
    );
  }
}

class PlayerStats extends Component {
  render() {
    const stats = this.props.stats;

    return (
      <div className="PlayerStats">
        <div>
          <span className="kills">{stats.championsKilled || 0}</span> <span className="separator">/</span> <span className="deaths">{stats.numDeaths || 0}</span> <span className="separator">/</span> {stats.assists || 0}
        </div>
        <div className="misc">
          {stats.minionsKilled} ({(stats.minionsKilled/(stats.timePlayed/60)).toFixed(1)})
        </div>
      </div>
    );
  }
}

class QueueName extends Component {
  constructor(props) {
    super(props);

    this.quenames = {
      NORMAL: "Normal 5v5",
      BOT: "Co-op vs AI",
      RANKED_SOLO_5x5: "Ranked 5v5",
      RANKED_PREMADE_3x3: "Team 3v3",
      RANKED_PREMADE_5x5: "Team 5v5",
      ODIN_UNRANKED: "odin",
      RANKED_TEAM_3x3: "Ranked Team 3v3",
      RANKED_TEAM_5x5: "Ranked Team 5v5",
      NORMAL_3x3: "Normal 3v3",
      ARAM_UNRANKED_5x5: "ARAM",
      RANKED_FLEX_SR: "Flex 5v5",
      RANKED_FLEX_TT: "Flex 3v3"
    }
  }

  render() {
    return <div className="QueueName">{this.quenames[this.props.que]}</div>;
  }
}

class SummonerSpell extends Component {
  render() {
    return <img className="SummonerSpell" src={`http://ddragon.leagueoflegends.com/cdn/6.24.1/img/spell/${this.props.image}`} alt="summoner spell"/>
  }
}

class Item extends Component {
  render() {
    let url;

    if (this.props.image) {
      url = `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/${this.props.image}`;
    } else {
      url = "";
    }

    return <img className="Item" src={url} alt="item"/>
  }
}

class Items extends Component {
  render() {
    return (
      <div className="Items">
        <div className="real-items">
          {this.props.items.map((item, index) => {
            if (item) {
              return <Item image={this.props.staticItems[item].image.full} />
            } else {
              return <div className="dummy-item"></div>
            }
          })}
        </div>

        <Item image={this.props.trinket ? this.props.staticItems[this.props.trinket].image.full : ""} />
      </div>
    );
  }
}

class Side extends Component {
  render() {
    return (
      <div className="Side">
        {this.props.players.map((item, index) => {
          return <div>{item.summonerId}</div>;
        })}
      </div>
    )
  }
}

class Champions extends Component {
  render() {
    let blue = this.props.summoners.filter((item, index) => {return item.teamId === 100;});
    let purple = this.props.summoners.filter((item, index) => {return item.teamId === 200;});

    return (
      <div className="Champions">
        <Side players={blue} />
        <Side players={purple} />
      </div>
    )
  }
}

class Match extends Component {
  render() {
    const game = this.props.game;
    const staticData = this.props.staticData;
    return (
      <div className={game.stats.win ? 'Match match-win' : 'Match match-lose'}>
        <div className="flex-container">
          <div>
            <ChampionIcon path={staticData.champions[game.championId].image.full} />
            <QueueName que={game.subType} />
            <div className="TimePlayed">{(game.stats.timePlayed/60).toFixed(0)}m</div>
          </div>

          <div>
            <SummonerSpell image={staticData.spells[game.spell1].image.full} />
            <SummonerSpell image={staticData.spells[game.spell2].image.full} />
          </div>

          <div>
            <PlayerStats stats={game.stats} />
          </div>

          <Items staticItems={staticData.items} items={[game.stats.item0, game.stats.item1, game.stats.item2, game.stats.item3, game.stats.item4, game.stats.item5]} trinket={game.stats.item6} />

          <Champions staticChampion={staticData.champions} summoners={game.fellowPlayers} />
        </div>
      </div>
    );
  }
}

class MatchHistory extends Component {
  render() {
    let games = this.props.matchHistory.games;
    return (
      <div className="MatchHistory">
        {games.map((match, index) => {
          return <Match staticData={this.props.staticData} game={match} key={match.gameId} />
        })}
      </div>
    );
  }
}

export default MatchHistory;
