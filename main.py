import pygame
import random
import sys
import os

# Инициализация Pygame
pygame.init()

# Установка размеров окна
screen_width = 700  # Обновлено для сетки 3x7
screen_height = 300
screen = pygame.display.set_mode((screen_width, screen_height))

# Установка заголовка окна
pygame.display.set_caption("Soccer Game")

# Цвета
green = (0, 128, 0)
white = (255, 255, 255)
black = (0, 0, 0)
red = (255, 0, 0)
blue = (0, 0, 255)
winning_color = (0, 255, 0)  # Зеленый для победы
bg_color = (50, 50, 50)  # Темно-серый для заднего фона текста

# Размеры сетки
rows = 3
cols = 7
cell_width = screen_width // cols
cell_height = screen_height // rows

# Функция для получения пути к ресурсам
def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)

# Загрузка изображений
player_img = pygame.image.load(resource_path('images/player.png'))
goalkeeper_img = pygame.image.load(resource_path('images/goalkeeper.png'))
ball_img = pygame.image.load(resource_path('images/ball.png'))

# Масштабирование изображений
player_img = pygame.transform.scale(player_img, (cell_width, cell_height))
goalkeeper_img = pygame.transform.scale(goalkeeper_img, (cell_width, cell_height))
ball_size = int(cell_width * 0.6)  # Размер мяча составляет 60% от ширины ячейки
ball_img = pygame.transform.scale(ball_img, (ball_size, ball_size))

# Функция отрисовки сетки
def draw_grid():
    for row in range(rows):
        for col in range(cols):
            rect = pygame.Rect(col * cell_width, row * cell_height, cell_width, cell_height)
            pygame.draw.rect(screen, white, rect, 1)

# Функция отрисовки ворот
def draw_goals():
    for row in range(rows):
        pygame.draw.rect(screen, blue, pygame.Rect(0, row * cell_height, cell_width, cell_height), 5)
        pygame.draw.rect(screen, red, pygame.Rect((cols - 1) * cell_width, row * cell_height, cell_width, cell_height), 5)

# Функция отображения элементов на поле
def draw_elements(player_pos, ball_pos, goalkeeper_pos, show_goalkeeper=True):
    screen.fill(green)
    draw_grid()
    draw_goals()
    screen.blit(player_img, (player_pos[0] * cell_width, player_pos[1] * cell_height))
    screen.blit(ball_img, (ball_pos[0] * cell_width + (cell_width - ball_size) // 2, ball_pos[1] * cell_height + (cell_height - ball_size) // 2))
    if show_goalkeeper:
        screen.blit(goalkeeper_img, (goalkeeper_pos[0] * cell_width, goalkeeper_pos[1] * cell_height))
    pygame.display.update()

# Функция для обработки кликов мыши
def get_cell_clicked(mouse_pos):
    x, y = mouse_pos
    col = x // cell_width
    row = y // cell_height
    return col, row

# Функция для отображения сообщения с фоном
def display_message(message, color, position):
    font = pygame.font.Font(None, 74)
    text = font.render(message, True, color)
    text_rect = text.get_rect(center=position)
    bg_rect = pygame.Rect(text_rect.left - 10, text_rect.top - 10, text_rect.width + 20, text_rect.height + 20)
    pygame.draw.rect(screen, bg_color, bg_rect)
    screen.blit(text, text_rect)
    pygame.display.update()
    return text_rect

# Функция анимации вратаря
def goalkeeper_animation(player_pos, ball_pos, goalkeeper_pos):
    while goalkeeper_pos != ball_pos:
        if goalkeeper_pos[0] < ball_pos[0]:
            goalkeeper_pos[0] += 1
        elif goalkeeper_pos[0] > ball_pos[0]:
            goalkeeper_pos[0] -= 1
        if goalkeeper_pos[1] < ball_pos[1]:
            goalkeeper_pos[1] += 1
        elif goalkeeper_pos[1] > ball_pos[1]:
            goalkeeper_pos[1] -= 1

        draw_elements(player_pos, ball_pos, goalkeeper_pos, show_goalkeeper=True)
        pygame.time.wait(200)  # Задержка для анимации

# Основной игровой цикл
def game_loop():
    player_pos = [0, rows // 2]
    ball_pos = player_pos[:]
    goalkeeper_pos = [cols - 1, random.randint(0, rows - 1)]
    mines = []

    # Заполнение минами случайных позиций, кроме начальной позиции игрока и последней клетки
    for _ in range(3):
        mine_pos = [random.randint(1, cols - 2), random.randint(0, rows - 1)]
        if mine_pos != ball_pos and mine_pos != goalkeeper_pos and mine_pos not in mines:
            mines.append(mine_pos)

    game_over = False

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.MOUSEBUTTONDOWN and not game_over:
                mouse_pos = pygame.mouse.get_pos()
                col, row = get_cell_clicked(mouse_pos)
                if ball_pos == player_pos:
                    # Ограничиваем движение только вперед и наискосок, когда на начальной позиции
                    if col == ball_pos[0] + 1 and abs(row - ball_pos[1]) <= 1:
                        ball_pos = [col, row]
                else:
                    # Ограничиваем движение только вперед, наискосок и прямо
                    if col == ball_pos[0] + 1 and abs(row - ball_pos[1]) <= 1:
                        ball_pos = [col, row]

                if ball_pos == goalkeeper_pos or ball_pos in mines:
                    game_over = True
                    goalkeeper_animation(player_pos, ball_pos, goalkeeper_pos)
                    display_message("Вы проиграли", red, (screen_width // 2, screen_height // 2 - 50))
                    pygame.time.wait(2000)
                    return
                elif col == cols - 1:  # Проверка, дошел ли игрок до противоположных ворот
                    game_over = True
                    display_message("Вы выиграли", winning_color, (screen_width // 2, screen_height // 2 - 50))
                    pygame.time.wait(2000)
                    return

        draw_elements(player_pos, ball_pos, goalkeeper_pos, show_goalkeeper=True)

while True:
    game_loop()
    restart_rect = display_message("Начать сначала", white, (screen_width // 2, screen_height // 2 + 50))
    pygame.time.wait(2000)
    # Обрабатываем события для перезапуска игры
    waiting_for_restart = True
    while waiting_for_restart:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.MOUSEBUTTONDOWN:
                mouse_pos = pygame.mouse.get_pos()
                if restart_rect.collidepoint(mouse_pos):
                    waiting_for_restart = False
                    game_loop()
