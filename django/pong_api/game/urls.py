from django.urls import path
from .views import player1_control, player2_control, create_game, get_game_state

urlpatterns = [
    path('player1/', player1_control, name ="player1-control"),
    path('player2/', player2_control, name ="player2-control"),
    path('create_game/', create_game, name = "create-game"),
    path('get_game_state/<int:game_id>/' , get_game_state, name = 'get-game-state'),
]