from django.urls import path
from .views import player_control, create_game, get_game_state,create_room, check_room, join_room, request_pid

urlpatterns = [
    path('request_pid/', request_pid, name='request-pid'),
    path('create_room/', create_room, name= 'create-room'),
    path('join_room/<str:room_id>/<str:player_id>/', join_room, name ='join-room'),
    path('check_room/<str:room_id>/' , check_room, name= 'check-room'),
    path('create_game/<str:room_id>/', create_game, name = "create-game"),
    path('get_game_state/<str:game_id>/' , get_game_state, name = 'get-game-state'),
    path('control/<str:game_id>/<str:player_id>/', player_control, name ="player-control"),
]