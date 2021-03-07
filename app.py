from flask import Flask, render_template, request, redirect
import os
import json

app = Flask(__name__)

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/login", methods=['POST'])
def loggedIn():
    return redirect("/")

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/schedule")
def schedule():
    return render_template("schedule.html")

@app.route("/settings")
def settings():
    return render_template("settings.html")
    
if __name__ == "__main__":
    app.run(port=5000)