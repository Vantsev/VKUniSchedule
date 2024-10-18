import './App.css';
import React, {useEffect, useState} from 'react';
import schedules from './all_schedules.json'; // Импортируем локальный файл JSON

// Компонент для вычисления четности недели
function useWeekParity() {
  const [isOddWeek, setIsOddWeek] = useState(false);

  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const today = new Date(year, month, 0).getTime();
    const now = new Date().getTime();
    const week = Math.ceil((now - today) / (1000 * 60 * 60 * 24 * 7));
    setIsOddWeek(week % 2 !== 0); // Четная неделя
  }, []);

  return isOddWeek;
}


// Функция для фильтрации занятий по текущей неделе
function filterLessonsByWeek(lessons, isOddWeek) {
  return lessons.filter((lesson) => {
    if (lesson.startsWith('▲') && isOddWeek) {
      return true; // Показываем для нечетной недели
    }
    if (lesson.startsWith('▼') && !isOddWeek) {
      return true; // Показываем для четной недели
    }
    if (!lesson.startsWith('▲') && !lesson.startsWith('▼')) {
      return true; // Показываем независимо от четности
    }
    return false; // Убираем занятия, которые не подходят по четности
  });
}


function App() {
    const isOddWeek = useWeekParity();
    const weekDescription = isOddWeek
        ? "▲ - верхняя (нечетная) неделя"
        : "▼ - нижняя (четная) неделя";

  const [groupId, setGroupId] = useState('');
  const [schedule, setSchedule] = useState(null); //Объявляем состояние для хранения расписания группы. Начальное значение — null.

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
      <p>{weekDescription}</p>
      <input
        type="text"
        placeholder="Введите ID группы"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />
      <button onClick={fetchSchedule}>Получить расписание</button>

      {schedule && ( // Если schedule не равно null, отображается блок с расписанием.
        <div>
          {schedule.error ? ( // Проверка на наличие ошибки в расписании. Если ошибки нет, отображаем расписание.
            <p>{schedule.error}</p>
          ) : (
            // Преобразуем объект расписания в массив и перебираем его. Расписание разбивается по ключам на группы и дни
            Object.entries(schedule).map(([day, lessons], index) => (
              <div key={index}>
                <h2>{day}</h2>
                {/* Перебираем пары на день и фильтруем их в зависимости от четности недели */}
                {Object.entries(lessons).map(([time, details], lessonIndex) => (
                  <div key={lessonIndex}>
                    <strong>{time}</strong>
                    {/* Фильтруем занятия по текущей неделе */}
                    {filterLessonsByWeek(details, isOddWeek).length > 0 ? (
                      <p>{filterLessonsByWeek(details, isOddWeek)[0]}</p>
                    ) : (
                      <p>Отдыхаем</p>
                    )}
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

//Просто функция для тестирования, чтобы не ломать app
function Test() {
  const [groupId, setGroupId] = useState('');
  const [schedule, setSchedule] = useState(null); //Объявляем состояние для хранения расписания группы. Начальное значение — null.

 useEffect(() => {
    console.log('Все расписания:',
      Object.entries(schedules).map(([group, days], index) => (
          Object.entries(days).map(([day, lessons], lessonIndex) => {
              return {group, days};
          }
     )))
    ); // Вывод всех расписаний в консоль

    setSchedule(schedules); // Устанавливаем расписания в состояние
  }, []); // Этот хук вызывается один раз при монтировании компонента

  return (
    <div>
      <h1>Все расписания (см. консоль)</h1>
      {/* Визуально ничего не отображаем, но можем использовать {schedule} для проверки */}
    </div>
  );
}

export default App;
