from flask import Flask, render_template 
import os

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/calendar")
def calendar():
    return render_template("calendar.html")
    
@app.route("/help")
def help():
    return render_template("help.html")

@app.route("/activity")
def activity():
    return render_template("activity.html")


    
if __name__ == "__main__":
    app.run(port=5000)