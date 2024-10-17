# import requests
import aiohttp
import aiodns

# api_get_url = "http://localhost:8000/api/get_players_input/"

# async def get_inputs():
#     async with aiohttp.ClientSession() as session:
#         try:
#             async with session.get(api_get_url) as response:
#                 if response.status == 200:
#                     return await response.json()
#                 else:
#                     print("FAILED API GET INPUT")
#         except Exception as e:
#             print(f"Error API GET INPUT : {e}")
#     # return {'player1_input': 'idle', 'player2_input': 'idle'}

# def create_game()