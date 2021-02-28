import subprocess
import re
from flask import Flask, redirect

app = Flask(__name__)

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
    

    async def do_setup():
        subprocess.run(["fldist", "run_air", "-p", "../../scripts/set_tetraplet.air", "-s", history_ClientSeed, "-d", jsonstring], stdout=subprocess.PIPE, text=True, timeout=20)

    do_setup()

    return redirect("/?history=%s&userlist=%s" % (history_ServiceID, userlist_ServiceID))



app.run(port=5000)