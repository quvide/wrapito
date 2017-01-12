from flask import Flask

from apihandler import api, cache

app = Flask(__name__)
app.register_blueprint(api)

@app.route("/magic/flush")
def flush():
	cache.flushall()
	return "done"

if __name__ == "__main__":
	app.run(debug=True, host="0.0.0.0")
