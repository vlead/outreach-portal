from flask import *
import requests
app = Flask(__name__)
app.secret_key = 'djfjsdkjXXS7979dfdfd'
app.config['SESSION_TYPE'] = 'filesystem'

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
                        session['email'] =  verification_data['email']
                        return 'Okay'
	else:
		return redirect_url('index')

@app.route('/auth/logout', methods=['POST'])
def logout_handler():
        session.pop('email', None)
        return "Ok"
        

if __name__ == "__main__":
        app.run(debug=True)
