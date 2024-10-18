import json
import re


# Функция для парсинга расписания и разбиения по дням, парам и их описаниям
def parse_schedule(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read().splitlines()

    schedules = {}
    current_group = None
    current_day = None
    current_schedule = {}

    group_pattern = re.compile(r'^\d{4}[А-ЯA-Zа-яa-z]*$')  # Регулярное выражение для поиска номера группы
    day_pattern = re.compile(r'^[А-Яа-я]+$')  # Регулярное выражение для поиска названия дня недели
    lesson_pattern = re.compile(
        r'^(\d+\sпара\s\(\d{2}:\d{2}–\d{2}:\d{2}\))')  # Регулярное выражение для поиска времени пары

    for line in content:
        line = line.strip()
        if group_pattern.match(line):  # Если найден номер группы
            if current_group:
                schedules[current_group] = current_schedule
            current_group = line
            current_schedule = {}
        elif day_pattern.match(line):  # Если найден день недели
            current_day = line
            current_schedule[current_day] = {}
        elif lesson_pattern.search(line):  # Если найдено время пары
            lesson_time = lesson_pattern.search(line).group(1)
            lesson_description = line.replace(lesson_time, '').strip()  # Удаляем время пары из строки
            current_schedule[current_day][lesson_time] = [lesson_description]

    if current_group:
        schedules[current_group] = current_schedule

    return schedules


# Функция для сохранения всех расписаний в один JSON-файл
def save_all_schedules_to_json(schedules):
    with open('src/all_schedules.json', 'w', encoding='utf-8') as json_file:
        json.dump(schedules, json_file, ensure_ascii=False, indent=4)
    print('Все расписания сохранены в файл all_schedules.json')


# Основная программа
file_path = 'all_schedules.txt'
schedules = parse_schedule(file_path)
save_all_schedules_to_json(schedules)
