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

  // Функция для отправки запроса
  const fetchSchedule = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/group/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_id: groupId }),  // Отправляем введённый ID группы
      });

      const data = await response.json();
      setSchedule(data.schedule);  // Обрабатываем ответ и выводим его
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
        onChange={(e) => setGroupId(e.target.value)}  // Обновляем значение ID группы
      />
      <button onClick={fetchSchedule}>Получить расписание</button>
      {schedule && <p>{schedule}</p>}  {/* Выводим ответ */}
    </div>
  );
}

export default App;