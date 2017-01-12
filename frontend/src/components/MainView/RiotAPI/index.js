class RiotAPI {
	constructor(region) {
    this.platforms = {
      euw: "EUW1",
      eune: "EUN1"
    }

		this.region = region;
		this.baseApiURL = `http://qux.fi:5000/api/${this.region}`;
	}

	normalizedSummonerName(name) {
		return name.replace("/ /g", "_").toLowerCase();
	}

	baseRequest(callback, url) {
		fetch(this.baseApiURL + url)
				.then((response) => {
					if (response.ok) {
						response.json().then((response) => {
							callback(response);
						})
					}
				});
	}

	summonerObject(callback, name) {
		this.baseRequest(callback, `/api/lol/${this.region}/v1.4/summoner/by-name/${name}`);
	}

	summonerLeague(callback, id) {
		if (Array.isArray(id)) {
			id = id.join(",");
		}

		this.baseRequest(callback, `/api/lol/${this.region}/v2.5/league/by-summoner/${id}/entry`);
	}

	matchHistory(callback, id) {
		this.baseRequest(callback, `/api/lol/${this.region}/v1.3/game/by-summoner/${id}/recent`);
	}

	staticChampions(callback) {
		this.baseRequest(callback, `/api/lol/static-data/${this.region}/v1.2/champion?dataById=true&champData=image`);
	}

  staticSummonerSpells(callback) {
		this.baseRequest(callback, `/api/lol/static-data/${this.region}/v1.2/summoner-spell?dataById=true&spellData=image`);
	}

  staticItems(callback) {
		this.baseRequest(callback, `/api/lol/static-data/${this.region}/v1.2/item?dataById=true&itemListData=image`);
	}

  liveGame(callback, id) {
		this.baseRequest(callback, `/observer-mode/rest/consumer/getSpectatorGameInfo/${this.platforms[this.region]}/${id}`);
	}
}

export default RiotAPI;
