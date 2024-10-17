from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Разрешение CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем запросы отовсюду для отладки
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель данных для получения запроса
class GroupRequest(BaseModel):
    group_id: str

# Маршрут для обработки POST-запроса
@app.post("/group/")
async def get_group_schedule(request: GroupRequest):
    if request.group_id == "1234":
        return {"schedule": "Расписание для группы 1234"}
    else:
        return {"schedule": "Группа не найдена"}
