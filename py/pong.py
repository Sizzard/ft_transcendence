import pygame, sys
from pygame.locals import *
from random import randint

pygame.init()

WIDTH, HEIGHT = 1280, 720
PAD_HEIGHT, PAD_WIDTH = HEIGHT / 7, WIDTH / 128
PAD_SPEED = 4

SCREEN = pygame.display.set_mode((WIDTH, HEIGHT))

pygame.display.set_caption("PONG")

p1_left = round(PAD_HEIGHT)
p1_top = round(HEIGHT/2-PAD_HEIGHT/2)
p2_left = round( WIDTH - PAD_HEIGHT)
p2_top = round(HEIGHT/2-PAD_HEIGHT/2)



p1 = pygame.Rect(p1_left,p1_top, 10, PAD_HEIGHT)
p2 = pygame.Rect(p2_left,p2_top, 10, PAD_HEIGHT)

ball_pos_x = WIDTH/2 
ball_pos_y = HEIGHT/2

score_p1 = 0
score_p2 = 0

ball = pygame.Rect(ball_pos_x, ball_pos_y, 10, 10)

ball_speed_x = 3
ball_speed_y = 3

ball_passed = False
rebounce = 0

def draw_game():
    SCREEN.fill((0,0,0))
    pygame.draw.rect(SCREEN, "white",p1)
    pygame.draw.rect(SCREEN, "white", p2)
    pygame.draw.rect(SCREEN, "white", ball)

def reset_ball(direction):
    global ball_pos_x,ball_pos_y,ball_speed_x,ball_speed_y,ball_passed,rebounce
    ball_pos_x = WIDTH/2
    ball_pos_y = HEIGHT/2
    ball_passed = False
    ball_speed_x = 4 * direction
    rebounce = 0

def calculate_rebounce():
    global ball_speed_x, ball_speed_y,ball_pos_x,ball_pos_y, ball_passed, score_p1, score_p2, rebounce
    if ball_pos_x + ball_speed_x < 0:
        reset_ball(1)
        score_p2 += 1
        print("Score :", score_p1, score_p2)
    elif ball_pos_x + ball_speed_x > WIDTH - 10:
        reset_ball(-1)
        score_p1 += 1
        print("Score :", score_p1, score_p2)

    if ball_pos_y + ball_speed_y < 0 \
    or ball_pos_y + ball_speed_y > HEIGHT - 10:
        ball_speed_y = -ball_speed_y

    if ball_pos_x + ball_speed_x < p1_left \
    and ball_pos_y + ball_speed_y > p1_top \
    and ball_pos_y + ball_speed_y < p1_top + PAD_HEIGHT \
    and ball_passed == False:
        rebounce += 1
        ball_speed_x = 3 + rebounce

    if ball_pos_x + ball_speed_x > p2_left \
    and ball_pos_y + ball_speed_y > p2_top \
    and ball_pos_y + ball_speed_y < p2_top + PAD_HEIGHT \
    and ball_passed == False:
        rebounce += 1
        ball_speed_x = - (3 + rebounce)

    if ball_pos_x < PAD_HEIGHT - ball_speed_x or ball_pos_x > WIDTH - PAD_HEIGHT - ball_speed_x:
        ball_passed = True

    print(f"""p1_left : {p1_left} , p1_top : {p1_top},  p2_left : {p2_left}, p2_top : {p2_top},  WIDTH : {WIDTH},  HEIGHT : {HEIGHT}  ,  ball_pos_x : {ball_pos_x},  ball_pos_y : {ball_pos_y}""")

print("Score :", score_p1, score_p2)
print("Ball_speed_x : ", ball_speed_x)


while score_p1 < 5 and score_p2 < 5:
    pygame.time.delay(10) 

    for event in pygame.event.get():

        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    keys = pygame.key.get_pressed()

    if keys[pygame.K_ESCAPE]:
        pygame.quit()
        sys.exit()

    if keys[pygame.K_UP] and p2_top > 0 :
        p2_top -= PAD_SPEED
    if keys[pygame.K_DOWN] and p2_top < HEIGHT -PAD_HEIGHT:
        p2_top += PAD_SPEED

    if keys[pygame.K_w] and p1_top > 0 :
        p1_top -= PAD_SPEED
    if keys[pygame.K_s] and p1_top < HEIGHT -PAD_HEIGHT:
        p1_top += PAD_SPEED

    calculate_rebounce()

    ball_pos_x += ball_speed_x
    ball_pos_y += ball_speed_y

    p1 = pygame.Rect(p1_left,p1_top, 10, PAD_HEIGHT)
    p2 = pygame.Rect(p2_left,p2_top, 10, PAD_HEIGHT)
    ball = pygame.Rect(ball_pos_x,ball_pos_y, 10, 10)
    
    draw_game()

    pygame.display.update()
