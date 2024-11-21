import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GameStateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f"game_{self.room_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def send_game_state(self, event):
        game_state = event['game_state']
        await self.send(text_data=json.dumps(game_state))