from django.urls import path
from .views import player_control, check_room, join_public_room, request_pid

urlpatterns = [
    path('request_pid/', request_pid, name='request-pid'),
    path('join_public_room/<str:player_id>/', join_public_room, name ='join-public-room'),
    # path('join_private_room/<str:player_id>/<str:room_id>/', join_private_room, name='join-private-room'),
    path('check_room/<str:room_id>/' , check_room, name= 'check-room'),
    path('control/<str:player_id>/', player_control, name ="player-control"),
]