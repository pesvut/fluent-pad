import subprocess
import re
from threading import Thread
from flask import Flask, redirect
from requests import exceptions

app = Flask(__name__)

class Compute(Thread):
    def __init__(self, func):
        Thread.__init__(self)
        self.func = func

    def run(self):
        print("doing thing")
        self.func()
        print("done")


@app.route('/api/new-room')
def create_record():

    # make new history thing
    historyData = subprocess.run(["fldist", "new_service", "--modules", "history.wasm:history.json", "--name", "pad-history"], stdout=subprocess.PIPE, text=True);
    historyText = historyData.stdout;

    # make new userlist thing
    userlistData = subprocess.run(["fldist", "new_service", "--modules", "user-list.wasm:user-list.json", "--name", "pad-user-list"], stdout=subprocess.PIPE, text=True);
    userlistText = userlistData.stdout;

    history_ClientSeed = re.search("client seed: (.*)", historyText).group(1)
    userlist_peerId = re.search("node peerId: (.*)", userlistText).group(1)
    history_ServiceID = re.search("service id: (.*)", historyText).group(1)
    userlist_ServiceID = re.search("service id: (.*)", userlistText).group(1)

    jsonstring = ("""'{
         "host":"%s", 
         "json_path":"$.[\\"is_authenticated\\"]",
         "function": "is_authenticated",
         "userlist":"%s",
         "history":"%s"
        }'""" % 
    (userlist_peerId,
        userlist_ServiceID,
        history_ServiceID)
    )

    def set_tetraplet():
        try: 
            subprocess.run(["fldist", "run_air", "-p", "../../scripts/set_tetraplet.air", "-s", history_ClientSeed, "-d", jsonstring], stdout=subprocess.PIPE, text=True, timeout=30)
        except subprocess.TimeoutExpired:
            print("set_tetraplet seems to have completed ok, timeout expired")
        except Exception as e:
            print("UNEXPECTED ERROR: ", e)
 
    thread_a = Compute(set_tetraplet)
    thread_a.start()

    return redirect("/?history=%s&userlist=%s" % (history_ServiceID, userlist_ServiceID))

app.run(port=5000)
