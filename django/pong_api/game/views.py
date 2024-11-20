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

publicRooms = {}
privateRooms = {}
games = {}

logger = logging.getLogger("mylogger")

def create_room_func():
    room_id = uuid.uuid4()
    newRoom = Room(room_id)
    privateRooms[str(room_id)] = newRoom
    return room_id

async def delete_room_game(game_id):
    await asyncio.sleep(5)
    games.pop(game_id)
    privateRooms.pop(game_id)
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
    game = Game(room_id ,privateRooms[str(room_id)].p1 ,privateRooms[str(room_id)].p2 ,bot_bool)
    games[str(room_id)] = game

    twisted_loop.create_task(game.run())

    return JsonResponse({"status": "success", "message": "Player added to the room.", "playerSlot": "2"}, status=200)

# Create your views here.

@api_view(['POST'])
def request_pid(request):
    newPID = uuid.uuid4()
    return JsonResponse({"player_id": newPID}, status=201)

@api_view(['POST'])
def create_room(request):
    id = create_room_func()
    return JsonResponse({"room_id": id}, status=201)

@api_view(['POST'])
def join_room(request, room_id, player_id):
    if room_id in privateRooms:
        playerSlot = privateRooms[room_id].add_player(player_id)
        if playerSlot == "1":
            return JsonResponse({"status": "success", "message": "Player added to the room.", "playerSlot": playerSlot}, status=200)
        elif playerSlot == "2":
            create_game(request, room_id)
            return JsonResponse({"status": "success", "message": "Player added to the room.", "playerSlot": playerSlot}, status=200)
            
        else:
            return JsonResponse({"status": "success", "message": "Player added to the room.", "playerSlot": playerSlot}, status=206)
    else:
        return JsonResponse({"error": "Room ID not found."}, status=404)

@api_view(['GET'])
def check_room(request, room_id):
    if room_id in privateRooms:
            if privateRooms[room_id].is_full() == True:
                return JsonResponse({"room_status": "OK"}, status=200) 
            else:
                return JsonResponse({"room_status": "KO"}, status=200)
    else:
        return JsonResponse({"error": "Room ID not found."}, status=404)

@api_view(['POST'])
def player_control(request,game_id,player_id):
    if game_id not in games:
        return JsonResponse({"error": "game not found"}, status=404)
    if player_id not in game_inputs[game_id]:
        return JsonResponse({"error": "invalid player id"}, status=404)

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
    

@api_view(['GET'])
def get_game_state(request, game_id):
    game = games.get(game_id)
    if game:
        state = game.get_game_state()
        if state.get("finished") == True :
            delete_room_game(game_id)
        return JsonResponse(state, status=200)
    return JsonResponse({"error": "game not found"}, status=404)
