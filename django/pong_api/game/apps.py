from django.apps import AppConfig
import asyncio
from .Game import Game

class GameConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'game'

#     def ready(self):
#         request_started.connect(start_game_logic)

# @receiver(request_started)
# def start_game_logic(sender, **kwargs):
#     print("Le seveur est pret a recevoir des requete")