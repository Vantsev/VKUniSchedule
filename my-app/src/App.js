import './App.css';
import React, { useState } from 'react';
import schedules from './all_schedules.json'; // Импортируем локальный файл JSON

function App() {
  const [groupId, setGroupId] = useState('');
  const [schedule, setSchedule] = useState(null);

  // Функция для получения расписания группы из локального JSON
  const fetchSchedule = () => {
    const groupSchedule = schedules[groupId];
    if (groupSchedule) {
      setSchedule(groupSchedule);  // Устанавливаем расписание
    } else {
      setSchedule({ error: 'Группа не найдена' });  // Если группа не найдена
    }
  };

  return (
    <div>
      <h1>Расписание группы</h1>
      <input
        type="text"
        placeholder="Введите ID группы"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />
      <button onClick={fetchSchedule}>Получить расписание</button>

      {schedule && (
        <div>
          {schedule.error ? (
            <p>{schedule.error}</p>
          ) : (
            Object.entries(schedule).map(([day, lessons], index) => (
              <div key={index}>
                <h2>{day}</h2>
                {Object.entries(lessons).map(([time, details], lessonIndex) => (
                  <div key={lessonIndex}>
                    <strong>{time}</strong>
                    {details.map((detail, detailIndex) => (
                      <p key={detailIndex}>{detail}</p>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
