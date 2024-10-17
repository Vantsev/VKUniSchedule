from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json


# Модель запроса для ввода ID группы
class GroupRequest(BaseModel):
    group_id: str

# Функция для получения расписания группы из JSON-файла
def get_schedule_for_group(group_id: str):
    try:
        with open("src/all_schedules.json", "r", encoding="utf-8") as json_file:
            schedules = json.load(json_file)
            if group_id in schedules:
                return schedules[group_id]
            else:
                return None
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Файл с расписанием не найден")

