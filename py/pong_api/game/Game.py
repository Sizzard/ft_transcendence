from .config import HEIGHT, WIDTH, PAD_HEIGHT, PAD_WIDTH, PAD_SPEED, MAX_SCORE, DEFAULT_BALL_SPEED
from .shared import game_inputs
import asyncio

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


            if game_inputs['player1_input'] == 'up' and self.p1_pos_y > 0 :
                self.p1_pos_y -= PAD_SPEED
            elif game_inputs['player1_input'] == 'down' and self.p1_pos_y < HEIGHT -PAD_HEIGHT:
                self.p1_pos_y += PAD_SPEED

            if game_inputs['player2_input'] == 'up' and self.p2_pos_y > 0 :
                self.p2_pos_y -= PAD_SPEED
            elif game_inputs['player2_input'] == 'down' and self.p2_pos_y < HEIGHT -PAD_HEIGHT:
                self.p2_pos_y += PAD_SPEED

            game_inputs['player1_input'] == 'idle'
            game_inputs['player2_input'] == 'idle'
            
            await self.calculate_rebounce()

            self.ball_pos_x += self.ball_speed_x
            self.ball_pos_y += self.ball_speed_y
            
            await asyncio.sleep(1/30)
        