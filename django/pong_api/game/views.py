from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import PlayerInputSerializer
from .Game import Game
from .shared import game_inputs
import asyncio
import json
from json.decoder import JSONDecodeError
# from adrf.view import APIView

games = {}

tasks = list()

# Create your views here.
@csrf_exempt
async def create_game(request):
    bot_bool = False
    try:
        data = json.loads(request.body)
        bot_bool = data.get('Bot', False)
    except JSONDecodeError as e:
        bot_bool = False
    game_id = len(games) + 1
    game = Game(game_id, bot_bool)
    games[game_id] = game

    asyncio.create_task(game.run())
    
    return JsonResponse({"game_id": game_id})

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
