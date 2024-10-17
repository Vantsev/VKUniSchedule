import './App.css';
import {
  AdaptivityProvider,
  ConfigProvider,
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Header,
  Group,
  SimpleCell,
  usePlatform,
    Input,
    Button,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

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

  const platform = usePlatform();

  return (
      <AppRoot>
        <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}>
          <SplitCol autoSpaced>
            <View activePanel="main">
              <Panel id="main">
                <PanelHeader>SUAI</PanelHeader>
                <Input type="text" placeholder="Введите номер группы" value={groupId} onChange={(e) => setGroupId(e.target.value)}></Input>
                <Button onClick = {fetchSchedule}>Получить расписание</Button>
                {schedule && (
                    <Panel id="shedule">
                      {schedule.map((item, index) => (<SimpleCell key={index}>{item}</SimpleCell>
                      ))}
                    </Panel>
                )}
              </Panel>
            </View>
          </SplitCol>
        </SplitLayout>
      </AppRoot>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // createRoot(container!) если вы используете TypeScript
root.render(
    <ConfigProvider>
      <AdaptivityProvider>
        <App />
      </AdaptivityProvider>
    </ConfigProvider>,
);

export default App;
