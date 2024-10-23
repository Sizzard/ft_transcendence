import requests

URL = "http://http://made-f0Ar3s2.clusters.42paris.fr:8000/api/player2/"

obj = {"input": "idle"}

while True:

    stdin = input("") 
    if stdin == "w":
        obj = {"input": "up"}
    elif stdin == "s":
        obj = {"input": "down"}
    else:
        obj = {"input": "idle"}


    response = requests.post(url = URL, json = obj)
    print(response.text)