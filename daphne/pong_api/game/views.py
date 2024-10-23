from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import PlayerInputSerializer
from .Game import Game
from .shared import game_inputs
import asyncio
# from adrf.view import APIView

games = {}

tasks = list()

# Create your views here.
@csrf_exempt
async def create_game(request):
    game_id = len(games) + 1
    game = Game(game_id)
    games[game_id] = game

    asyncio.create_task(game.run())
    
    return JsonResponse({"message": "Game created", "game_id": game_id})

@api_view(['POST'])
def player1_control(request):
    serializer = PlayerInputSerializer(data=request.data)
    if serializer.is_valid():
        game_inputs["player1_input"] = serializer.validated_data['input']
        return Response({"status": "OK", "game_inputs[player1_input]": game_inputs["player1_input"]})
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def player2_control(request):
    serializer = PlayerInputSerializer(data=request.data)
    if serializer.is_valid():
        game_inputs["player2_input"] = serializer.validated_data['input']
        return Response({"status": "OK", "game_inputs[player2_input]": game_inputs["player2_input"]})
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_game_state(request, game_id):
    game = games.get(game_id)
    if game:
        return JsonResponse(game.get_game_state())
    return JsonResponse({"error": "game not found"}, status =404)
