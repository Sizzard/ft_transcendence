from django.urls import path
from .views import player1_control, player2_control, create_game, get_game_state,create_room, check_room, join_room

urlpatterns = [
    path('player1/<int:game_id>/', player1_control, name ="player1-control"),
    path('player2/<int:game_id>/', player2_control, name ="player2-control"),
    path('create_game/<str:room_id>/', create_game, name = "create-game"),
    path('get_game_state/<str:game_id>/' , get_game_state, name = 'get-game-state'),
    path('create_room/', create_room, name= 'create-room'),
    path('join_room/<str:room_id>/', join_room, name ='join-room'),
    path('check_room/<str:room_id>/' , check_room, name= 'check-room'),
]