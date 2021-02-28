import subprocess
import re

files = subprocess.run(["ls", "."])

"""
    client seed: Fs6nQaGEsM5EgnprUbUtoLYWhUC8o6QK1gseP9pfhzUm
    client peerId: 12D3KooWH2hc6NAE2t6EE5SjmhTtce8VieUiKYNw4ynVCqV6jf6w
    node peerId: 12D3KooWBUJifCTgaxAUrcM9JysqCcS4CS8tiYH5hExbdWCAoNwb
    ...
    service id: 64ea579e-b863-4a42-b80c-e7b5ec1ab7fa
    service created successfully
"""
# make new history thing
historyData = subprocess.run(["fldist", "new_service", "--modules", "history.wasm:history.json", "--name", "pad-history"], stdout=subprocess.PIPE, text=True);
historyText = historyData.stdout;


"""
   client seed: HaBkus2i7bg6DmvxxSwizcxeo3xhvVJA9wLjyQji4mWc
    client peerId: 12D3KooWR4WGTieeectXFtJxgVqB8vvk3kn531rTdk4pwt4mBn5x
    node peerId: 12D3KooWBUJifCTgaxAUrcM9JysqCcS4CS8tiYH5hExbdWCAoNwb
    ...
    service id: 91041afe-0c3c-451a-9003-6bb92a570aae
    service created successfully
"""
# make new userlist thing
userlistData = subprocess.run(["fldist", "new_service", "--modules", "user-list.wasm:user-list.json", "--name", "pad-user-list"], stdout=subprocess.PIPE, text=True);
userlistText = userlistData.stdout;


print(historyText);
print(userlistText);

history_ClientSeed = re.search("client seed: (.*)", historyText).group(1)
history_ServiceID = re.search("service id: (.*)", historyText).group(1)
userlist_peerId = re.search("node peerId: (.*)", userlistText).group(1)
userlist_ServiceID = re.search("service id: (.*)", userlistText).group(1)


print("COPYPASTE: ")
print("""
export const historyServiceId = '%s';
export const userListServiceId = '%s';
""" % (
history_ServiceID,
userlist_ServiceID
))

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

subprocess.run(["fldist", "run_air", "-p", "../../scripts/set_tetraplet.air", "-s", history_ClientSeed, "-d", jsonstring]);
