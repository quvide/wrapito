import React, { Component } from "react";

import "./style.css";

class Queue extends Component {
	constructor(props) {
		super(props);

		this.queNames = {
			RANKED_FLEX_SR: "Flex Summoner's Rift",
			RANKED_FLEX_TT: "Flex Twisted Treeline",
			RANKED_SOLO_5x5: "Solo/Duo Summoner's Rift",
			RANKED_TEAM_3x3: "Team Twisted Treeline",
			RANKED_TEAM_5x5: "Team Summoner's Rift"
		};
	}

	winrate(w, l) {
		return Math.round(100*w/(w+l));
	}

	colourByWinrate(winrate) {
		let min = 40;
		let max = 60;

		winrate -= min;
		if (winrate < 0) {
			winrate = 0;
		} else if (winrate > (max-min)) {
			winrate = (max-min);
		}

		winrate /= (max-min);
		winrate *= 255;
		winrate = Math.round(winrate);

		return `rgb(${255-winrate}, ${winrate}, 0)`;
	}

  getImageUrl(league, division) {
    if (league !== "challenger") {
      return `../rank_icons/tier_icons/${league}_${division}.png`
    } else {
      return `../rank_icons/base_icons/${league}.png`
    }
  }

	render() {
		let queue = this.props.queue;
		let winrate = this.winrate(queue.entries[0].wins, queue.entries[0].losses);
    let lp = "";
    if (queue.entries[0].miniSeries) {
      const progress = queue.entries[0].miniSeries.progress;
      for (const letter of progress) {
        if (letter === "L") {
          lp += "✗";
        } else if (letter === "W") {
          lp += "✓";
        } else if (letter === "N") {
          lp += "—"
        }
      }
    } else {
      lp = `${queue.entries[0].leaguePoints} LP`;
    }

		return (
			<div className="queue">
				<img src={this.getImageUrl(queue.tier.toLowerCase(), queue.entries[0].division.toLowerCase())} alt={queue.tier.toLowerCase()} className="tier-icon"/>
				<div className="queue-meta">
					<p>{this.queNames[queue.queue]}</p>

					<p>{queue.tier} {queue.entries[0].division} &nbsp;({lp})</p>

					<p>
            <span className="big-winrate" style={{color: this.colourByWinrate(winrate)}}>{winrate}%</span>
            <span className="separator"> / </span>
            <span className="wins">{queue.entries[0].wins}</span>&ndash;
            <span className="losses">{queue.entries[0].losses}</span>
          </p>
				</div>
			</div>
		);
	}
}

class ProfileRank extends Component {
	render() {
		let queues = [];
		if (this.props.league) {
			for (const el of this.props.league) {
				if (el.queue === "RANKED_SOLO_5x5") {
					queues.push(el);
				} else if (el.queue === "RANKED_FLEX_SR") {
					queues.push(el);
				}
			}
		}

		if (queues.length > 0) {
			return (
				<div className="ProfileRank">
					{queues.map((queue, idx) => {
						return (
							<div className="queue-container" key={queue.queue}>
								{idx === 0 ? "" : <hr/>}
								<Queue queue={queue}/>
							</div>
						);
					})}
				</div>
			);
		} else {
			return null;
		}
	}
}

export default ProfileRank;
