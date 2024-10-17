import './App.css';
import {
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Header,
  Group,
  SimpleCell,
  Button,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import React, { useState } from 'react';

function App() {
  const [groupId, setGroupId] = useState('');
  const [schedule, setSchedule] = useState(null);

  // Функция для получения расписания группы
  const fetchSchedule = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/group/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_id: groupId }),  // Отправляем ID группы
      });

      const data = await response.json();
      if (data.schedule) {
        setSchedule(data.schedule);  // Выводим расписание
      } else {
        setSchedule(['Группа не найдена']);  // Если группа не найдена
      }
    } catch (error) {
      console.error('Ошибка:', error);
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
          {schedule.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;