from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from daphne.server import twisted_loop
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import PlayerInputSerializer
from .shared import game_inputs
from .Game import Game
from .Room import Room
import asyncio
import json
from json.decoder import JSONDecodeError
import uuid
import logging

privateRooms = {}
publicRooms = {}
games = {}

logger = logging.getLogger("mylogger")

def create_room_func():
    room_id = uuid.uuid4()
    newRoom = Room(room_id)
    publicRooms[str(room_id)] = newRoom
    return room_id

async def delete_room_game(game_id):
    await asyncio.sleep(5)
    games.pop(game_id)
    publicRooms.pop(game_id)
    privateRooms.pop(game_id)

def create_game(request, room_id):

    if room_id in games :
        return JsonResponse({"message": "Game already created"}, status=202)

    bot_bool = False
    try:
        data = json.loads(request.body)
        bot_bool = data.get('Bot', False)
    except JSONDecodeError as e:
        bot_bool = False
    game = Game(room_id ,publicRooms[str(room_id)].p1 ,publicRooms[str(room_id)].p2 ,bot_bool)
    games[str(room_id)] = game
    print(games[str(room_id)])

    twisted_loop.create_task(game.run())

    return JsonResponse({"status": "success", "message": "Player added to the room.", "playerSlot": "2"}, status=200)

def create_public_room_and_add_player(player_id):
    id = create_room_func()
    playerSlot = publicRooms[str(id)].add_player(player_id)
    return JsonResponse({"status": "success", "room_id": id, "playerSlot": playerSlot}, status=200)

def join_last_public_room(request, room_id, player_id):
    playerSlot = publicRooms[str(room_id)].add_player(player_id)
    create_game(request, room_id)
    return JsonResponse({"status": "success", "room_id": room_id, "playerSlot": playerSlot}, status=200)

# Create your views here.

@api_view(['POST'])
def request_pid(request):
    newPID = uuid.uuid4()
    return JsonResponse({"player_id": newPID}, status=201)

@api_view(['POST'])
def join_public_room(request, player_id):
    last_key = None
    if publicRooms:
        last_key = list(publicRooms.keys())[-1]
    if not publicRooms: # Empty/No room
        return create_public_room_and_add_player(player_id)
    elif publicRooms and publicRooms[str(last_key)].is_full() is True: # Room but full
        return create_public_room_and_add_player(player_id)
    else: # Room without P2
        return join_last_public_room(request, last_key, player_id)

@api_view(['GET'])
def check_room(request, room_id):
    if room_id in publicRooms:
            if publicRooms[room_id].is_full() == True:
                return JsonResponse({"room_status": "OK"}, status=200) 
            else:
                return JsonResponse({"room_status": "KO"}, status=200)
    else:
        return JsonResponse({"error": "Room ID not found."}, status=404)

@api_view(['POST'])
def player_control(request,player_id):
    pid =  None
    game_id = None
    for game in games.values():
        if game.p1_id == player_id or game.p2_id == player_id:
            pid = player_id
            game_id = game.id
            break

    if pid is None:
        return JsonResponse({"error": "invalid player_id" }, status=404)

    data = request.data
    player_input = data.get('input')
    
    if player_input not in ["up", "down", "idle"]:
        return JsonResponse({"error": "invalid input"}, status=400)
    
    game_inputs[game_id][player_id] = player_input
    
    return JsonResponse({
        "status": "OK", 
        "game_id": game_id, 
        player_id: player_input
    }, status=200)