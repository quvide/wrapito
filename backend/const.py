import configparser
config = configparser.ConfigParser()
config.read("config.ini")

API_KEY = config["General"]["API_KEY"]

print("Read api key: {}".format(API_KEY))

REGIONS = {
	"EUW": {"platform_id": "EUW1", "host": "euw.api.pvp.net"},
	"EUNE": {"platform_id": "EUN1", "host": "eune.api.pvp.net"},
	"GLOBAL": {"host": "global.api.pvp.net"}
}
