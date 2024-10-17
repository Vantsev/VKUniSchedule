from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import re

app = FastAPI()

# Разрешение CORS для React-приложения
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель запроса для ввода ID группы
class GroupRequest(BaseModel):
    group_id: str

# Функция для получения расписания группы из текстового файла
def get_schedule_for_group(group_id: str):
    try:
        with open("groups_schedule.txt", "r", encoding="utf-8") as file:
            content = file.read().splitlines()
            schedule = []
            capture = False
            # Регулярное выражение для идентификации групп
            group_pattern = re.compile(r"^\d{4}[А-ЯA-Zа-яa-z]*$")  # Группы могут содержать цифры и буквы

            for line in content:
                # Если находим строку с указанной группой
                if re.match(rf"^{group_id}$", line):
                    capture = True
                # Если находим другую группу (четырехзначное число с буквами или без)
                elif group_pattern.match(line) and capture:
                    break
                # Если мы в процессе захвата расписания для нужной группы
                elif capture:
                    schedule.append(line)

            if not schedule:
                return None
            return schedule
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Файл с расписанием не найден")

# Эндпоинт для получения расписания группы
@app.post("/group/")
async def get_group_schedule(request: GroupRequest):
    schedule = get_schedule_for_group(request.group_id)
    if schedule:
        return {"group_id": request.group_id, "schedule": schedule}
    else:
        return {"error": "Расписание для группы не найдено"}
