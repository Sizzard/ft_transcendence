from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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

rooms = {}
games = {}

logger = logging.getLogger("mylogger")

def create_room_func():
    room_id = uuid.uuid4()
    newRoom = Room(room_id)
    rooms[str(room_id)] = newRoom
    return room_id

# Create your views here.
@csrf_exempt
async def create_game(request, room_id):
    if room_id in games :
        return JsonResponse({"error": "Game already created"}, status=400)
    bot_bool = False
    try:
        data = json.loads(request.body)
        bot_bool = data.get('Bot', False)
    except JSONDecodeError as e:
        bot_bool = False
    game = Game(room_id, bot_bool)
    games[str(room_id)] = game

    asyncio.create_task(game.run())
    
    return JsonResponse({"game_id": room_id}, status=200)
        

@api_view(['POST'])
def create_room(request):
    id = create_room_func()
    return JsonResponse({"room_id": id}, status=200)

@api_view(['POST'])
def join_room(request, room_id):
    if room_id in rooms:
        try:
            rooms[room_id].add_player("TEST")
            return JsonResponse({"status": "success", "message": "Player added to the room."}, status=200)
        except ValueError as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Room ID not found."}, status=404)


def game_room(request, room_id):
    return render(request, 'index.html', {'room_id': room_id})

@api_view(['GET'])
def check_room(request, room_id):
    print("room_id")
    if room_id in rooms:
            if rooms[room_id].is_full() == True:
                return JsonResponse({"room_status": "OK"}, status=200) 
            else:
                return JsonResponse({"room_status": "KO"}, status=200)
    else:
        return JsonResponse({"error": "Room ID not found."}, status=404)

@api_view(['POST'])
def player1_control(request,game_id):
    serializer = PlayerInputSerializer(data=request.data)
    if serializer.is_valid():
        game_inputs[game_id]["player1_input"] = serializer.validated_data['input']
        return Response({"status": "OK", "game_inputs[game_id][player1_input]": game_inputs[game_id]["player1_input"]})
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def player2_control(request, game_id):
    serializer = PlayerInputSerializer(data=request.data)
    if serializer.is_valid():
        game_inputs[game_id]["player2_input"] = serializer.validated_data['input']
        return Response({"status": "OK", "game_inputs[game_id][player2_input]": game_inputs[game_id]["player2_input"]})
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_game_state(request, game_id):
    game = games.get(game_id)
    if game:
        return JsonResponse(game.get_game_state())
    return JsonResponse({"error": "game not found"}, status =404)
