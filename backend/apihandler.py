import redis
import requests
import json
import re

from flask import request, Response, abort, Blueprint, g

from limiter import Limiter
from const import *

api = Blueprint("api", __name__, url_prefix="/api/<proxy>")

@api.url_value_preprocessor
def pull_proxy(endpoint, values):
	g.proxy = values.pop("proxy")

cache = redis.Redis()

limits = {}
for region in REGIONS:
	limits[region] = [Limiter(500, 600), Limiter(10, 10)]

def jsonify(data):
	res = Response(data["json"], mimetype="application/json")
	res.headers["Access-Control-Allow-Origin"] = "*"
	res.status_code = data["status_code"]
	return res

def RiotRequest(path, extra_params={}, ttl=60):
	# FIXME: DIFFERENT EXTRA PARAMS ARE TREATED AS SAME!

	if g.proxy.upper() not in REGIONS:
		abort(501)

	noprefix_path = re.sub(r"^\/.*?\/.*?(?=\/)", "", path)
	if not cache.exists(path):
		url = "https://{region_domain}{path}".format(
				region_domain = REGIONS[g.proxy.upper()]["host"],
				path          = noprefix_path
		)

		can_request = True
		for limiter in limits[g.proxy.upper()]:
			if not limiter.request_available:
				can_request = False

		if can_request:
			extra_params["api_key"] = API_KEY
			req = requests.get(url, params=extra_params)
			print("sent request to {}".format(url))
			res = {"status_code": req.status_code, "json": req.text}
			for limiter in limits[g.proxy.upper()]:
				limiter.add()
		else:
			abort(420) # enchance your calm

		cache.set(path, json.dumps(res), ex=ttl)
		print("wrote to cache:")
		#print("  " + path)
	else:
		print("cache still valid for {}".format(cache.ttl(path)))

	return jsonify(json.loads(cache.get(path).decode("utf-8")))


@api.route("/api/lol/<region>/v1.2/champion")
def champion(region):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/<region>/v1.2/champion/<int:id>")
def champion_by_id(region, id):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/observer-mode/rest/consumer/getSpectatorGameInfo/<platform_id>/<int:summoner_id>")
def current_game(platform_id, summoner_id):
	if REGIONS[g.proxy.upper()]["platform_id"] != platform_id:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/<region>/v1.3/game/by-summoner/<int:summoner_id>/recent")
def game(region, summoner_id):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/<region>/v1.4/summoner/by-name/<summoner_names>")
def summoner_by_name(region, summoner_names):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/<region>/v1.4/summoner/<summoner_ids>")
def summoner_by_id(region, summoner_ids):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/<region>/v1.4/summoner/<summoner_ids>/masteries")
def summoner_masteries_by_id(region, summoner_ids):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/<region>/v1.4/summoner/<summoner_ids>/name")
def summoner_names_by_id(region, summoner_ids):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/<region>/v1.4/summoner/<summoner_ids>/runes")
def summoner_runes_by_id(region, summoner_ids):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/<region>/v2.5/league/by-summoner/<summoner_ids>")
def league_by_id(region, summoner_ids):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/<region>/v2.5/league/by-summoner/<summoner_ids>/entry")
def league_entry_by_id(region, summoner_ids):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/<region>/v1.3/stats/by-summoner/<summoner_id>/ranked")
def stats_ranked_by_id(region, summoner_id):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path, extra_params=request.args.to_dict())

@api.route("/api/lol/<region>/v1.3/game/by-summoner/<summoner_id>/recent")
def match_history_by_id(region, summoner_ids):
	if g.proxy != region:
		abort(501)

	return RiotRequest(request.path)

@api.route("/api/lol/static-data/<region>/v1.2/champion")
def static_champions(region):
	g.proxy = "global"

	return RiotRequest(request.path, extra_params=request.args.to_dict(), ttl=60*60*24)

@api.route("/api/lol/static-data/<region>/v1.2/item")
def static_items(region):
	g.proxy = "global"

	return RiotRequest(request.path, extra_params=request.args.to_dict(), ttl=60*60*24)

@api.route("/api/lol/static-data/<region>/v1.2/summoner-spell")
def static_summoners(region):
	g.proxy = "global"

	return RiotRequest(request.path, extra_params=request.args.to_dict(), ttl=60*60*24)
