from flask import *
import requests
app = Flask(__name__)


@app.route("/")
def index():
	return render_template("index.html")

@app.route("/auth/login", methods=['GET','POST'])
def login():
	if request.method == 'POST':
		if 'assertion' not in request.form:
			abort(400)
		data = {'assertion': request.form['assertion'], 'audience': 'http://localhost:5000/'}
		resp = requests.post('https://verifier.login.persona.org/verify', data=data, verify=True)

		if resp.ok:
			verification_data = resp.json()

		if verification_data['status'] == 'okay':
			return 'Okay'
	else:
		return redirect_url('index')
if __name__ == "__main__":
	app.run(debug=True)