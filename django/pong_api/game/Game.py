from .config import HEIGHT, WIDTH, PAD_HEIGHT, PAD_WIDTH, PAD_SPEED, MAX_SCORE, DEFAULT_BALL_SPEED, FPS
from .shared import game_inputs
import asyncio
import random
import time

BOT_BOOL = True

class Bot:
    def __init__(self,gameID):
        self.id = gameID
        self.last_time = time.time()
        self.last_speed = 0
        self.impact_pos_x = 0
        self.impact_pos_y = 0

class Game:
    def __init__(self,gameID):
        self.id = gameID
        self.p1_pos_x = round(PAD_HEIGHT)
        self.p1_pos_y = round(HEIGHT/2-PAD_HEIGHT/2)
        self.p2_pos_x = round( WIDTH - PAD_HEIGHT)
        self.p2_pos_y = round(HEIGHT/2-PAD_HEIGHT/2)
        self.score_p1 = 0
        self.score_p2 = 0
        self.rebounce = 0
        self.ball_passed = False
        self.ball_pos_x = WIDTH /2
        self.ball_pos_y = HEIGHT/2
        self.ball_speed_x = DEFAULT_BALL_SPEED
        self.ball_speed_y = DEFAULT_BALL_SPEED
        self.bot = Bot(gameID)

    def reset_ball(self, direction):
        self.ball_pos_x = WIDTH/2
        self.ball_pos_y = HEIGHT/2
        self.ball_passed = False
        self.ball_speed_x = DEFAULT_BALL_SPEED * direction
        self.rebounce = 0

    def get_game_state(self):
        game_state = {
        "id" :  self.id,
        "width" : WIDTH,
        "height" : HEIGHT,
        "p1_pos_x" : self.p1_pos_x,
        "p1_pos_y" : self.p1_pos_y,
        "p2_pos_x" : self.p2_pos_x,
        "p2_pos_y" : self.p2_pos_y,
        "score_p1" : self.score_p1,
        "score_p2" : self.score_p2,
        "ball_pos_x" : self.ball_pos_x,
        "ball_pos_y" : self.ball_pos_y,
        }
        return game_state

    def bot_comportement(self):
        self.bot.impact_pos_x = self.ball_pos_x + self.ball_speed_x * FPS
        # Balle qui descends
        if self.ball_speed_y > 0 :
            self.bot.impact_pos_y = (self.ball_pos_y - PAD_HEIGHT / 2) + self.ball_speed_y * FPS
            if self.bot.impact_pos_y > HEIGHT :
                res = self.bot.impact_pos_y - HEIGHT
                self.bot.impact_pos_y = HEIGHT - res - PAD_HEIGHT
        # Balle qui monte
        elif self.ball_speed_y < 0 :
            self.bot.impact_pos_y = (self.ball_pos_y - PAD_HEIGHT / 2) + self.ball_speed_y * FPS
            if self.bot.impact_pos_y < 0 :
                self.bot.impact_pos_y = -self.bot.impact_pos_y - PAD_HEIGHT

    def handle_player_inputs(self):
        if game_inputs['player1_input'] == 'up' and self.p1_pos_y > 0 :
            self.p1_pos_y -= PAD_SPEED
        elif game_inputs['player1_input'] == 'down' and self.p1_pos_y < HEIGHT - PAD_HEIGHT:
            self.p1_pos_y += PAD_SPEED

        current_time = time.time()

        if BOT_BOOL == False :
            if game_inputs['player2_input'] == 'up' and self.p2_pos_y - PAD_SPEED > 0 :
                self.p2_pos_y -= PAD_SPEED
            elif game_inputs['player2_input'] == 'down' and self.p2_pos_y + PAD_SPEED < HEIGHT - PAD_HEIGHT:
                self.p2_pos_y += PAD_SPEED
        elif BOT_BOOL == True :
            if current_time - self.bot.last_time >= 1:
                self.bot_comportement()
                self.bot.last_time = current_time
            if self.p2_pos_y > self.bot.impact_pos_y and self.p2_pos_y - PAD_SPEED > 0:
                self.p2_pos_y -= PAD_SPEED
            elif self.p2_pos_y < self.bot.impact_pos_y and self.p2_pos_y + PAD_SPEED < HEIGHT - PAD_HEIGHT:
                self.p2_pos_y += PAD_SPEED
            
    async def calculate_rebounce(self):
            if self.ball_pos_x + self.ball_speed_x < 0:
                self.reset_ball(1)
                self.score_p2 += 1
            elif self.ball_pos_x + self.ball_speed_x > WIDTH - 10:
                self.reset_ball(-1)
                self.score_p1 += 1

            if self.ball_pos_y + self.ball_speed_y < 0 \
            or self.ball_pos_y + self.ball_speed_y > HEIGHT - 10:
                self.ball_speed_y = -self.ball_speed_y

            if self.ball_pos_x + self.ball_speed_x < self.p1_pos_x \
            and self.ball_pos_y + self.ball_speed_y > self.p1_pos_y \
            and self.ball_pos_y + self.ball_speed_y < self.p1_pos_y + PAD_HEIGHT \
            and self.ball_passed == False:
                self.rebounce += 1
                self.ball_speed_x = DEFAULT_BALL_SPEED + self.rebounce

            if self.ball_pos_x + self.ball_speed_x > self.p2_pos_x \
            and self.ball_pos_y + self.ball_speed_y > self.p2_pos_y \
            and self.ball_pos_y + self.ball_speed_y < self.p2_pos_y + PAD_HEIGHT \
            and self.ball_passed == False:
                self.rebounce += 1
                self.ball_speed_x = - (DEFAULT_BALL_SPEED + self.rebounce)

            if self.ball_pos_x < PAD_HEIGHT - self.ball_speed_x or self.ball_pos_x > WIDTH - PAD_HEIGHT - self.ball_speed_x:
                self.ball_passed = True

    async def run(self):
        while self.score_p1 < MAX_SCORE and self.score_p2 < MAX_SCORE:

            self.handle_player_inputs()
            
            await self.calculate_rebounce()

            self.ball_pos_x += self.ball_speed_x
            self.ball_pos_y += self.ball_speed_y
            
            await asyncio.sleep(1/FPS)
        