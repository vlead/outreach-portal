from flask import *
import requests
app = Flask(__name__)


@app.route("/")
def index():
	return render_template("index.html")

@app.route("/auth/login", methods=['GET','POST'])
def login():
# The request has to have an assertion for us to verify
   if 'assertion' not in request.form:
       abort(400)

   # Send the assertion to Mozilla's verifier service.
   data = {'assertion': request.form['assertion'], 'audience': 'http://localhost:5000/'}
   resp = requests.post('https://verifier.login.persona.org/verify', data=data, verify=True)
   #print request.form['assertion']
   # Did the verifier respond?
   if resp.ok:
       # Parse the response
       verification_data = resp.json()

       # Check if the assertion was valid
       if verification_data['status'] == 'okay':
           return 'Okay'

if __name__ == "__main__":
	app.run(debug=True)