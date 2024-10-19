import './App.css';
import React, {useEffect, useState} from 'react';
import schedules from './all_schedules.json'; // Импортируем локальный файл JSON
import {
    AppRoot,
    SplitLayout,
    SplitCol,
    View,
    Panel,
    PanelHeader,
    Group,
    FormItem,
    Input,
    Button,
    Header,
    SimpleCell,
    Div,
    ConfigProvider,
    AdaptivityProvider,
    Text, ButtonGroup,
    Textarea,
    IconButton,
    Select
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {createRoot} from "react-dom/client";


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
    const [viewType, setViewType] = useState('full');

    // Функция для получения расписания группы из локального JSON
    const fetchSchedule = () => {
        const groupSchedule = schedules[groupId];
        if (groupSchedule) {
            setSchedule(groupSchedule);  // Устанавливаем расписание
        } else {
            setSchedule({error: 'Группа не найдена'});  // Если группа не найдена
        }
    };
    const handleFullfetchSchedule = () =>{
        setViewType('full');
        fetchSchedule();
    }
    const handleCurrentfetchSchedule = () =>{
        setViewType('current');
        fetchSchedule();
    }
    const clearG = () => {
        document.getElementById("groupInput").value = '';
    }
    const clearT = () => {
        document.getElementById("teacherInput").value = '';
    }
    const clearA = () => {
        document.getElementById("aditInput").value = '';
    }
    useEffect(() => {
        if (schedule && schedule.error) {
            clearG(); // Вызов функции clear, если есть ошибка
        }
    }, [schedule]);
    return (
        <ConfigProvider>
            <AdaptivityProvider>
                <AppRoot>
                    <SplitLayout>
                        <SplitCol>
                            <View activePanel="main">
                                <Panel id="main">
                                    <PanelHeader>Расписание группы</PanelHeader>
                                    <Group>
                                        <Div> {weekDescription} </Div>
                                        <FormItem top="Введите номер группы">
                                            <Input
                                                type="text"
                                                id="groupInput"
                                                placeholder="Введите номер группы"
                                                value={groupId}
                                                onChange={(e) => setGroupId(e.target.value)}
                                                after={
                                                    <IconButton hoverMode="opacity" label="Очистить поле"
                                                                onClick={clearG}>
                                                        ❌
                                                    </IconButton>
                                                }
                                            />
                                        </FormItem>
                                        <div className="input-container">
                                            <FormItem top="Введите фамилию преподавателя" id="formTinput">
                                                <Input
                                                    type="text"
                                                    id="teacherInput"
                                                    placeholder="Введите фамилию преподавателя"
                                                    after={
                                                        <IconButton hoverMode="opacity" label="Очистить поле"
                                                                    onClick={clearT}>
                                                            ❌
                                                        </IconButton>
                                                    }
                                                />
                                            </FormItem>
                                            <FormItem top="Выберите корпус" id="formKinput">
                                                <Select
                                                    placeholder="Выберите корпус"
                                                    options={[
                                                        { label: 'Выберите корпус', value: 'pusto' }
                                                        { label: 'БМ', value: 'BM' },
                                                        { label: 'Гаста', value: 'Gasta' },
                                                        { label: 'Ленса', value: 'Lensa' },
                                                    ]}
                                                />
                                            </FormItem>
                                            <FormItem top="Введите Номер аудитории" id="formAinput">
                                                <Input
                                                    type="text"
                                                    id="aditInput"
                                                    placeholder="Введите номер аудитории"
                                                    after={
                                                        <IconButton hoverMode="opacity" label="Очистить поле"
                                                                    onClick={clearA}>
                                                            ❌
                                                        </IconButton>
                                                    }
                                                />
                                            </FormItem>
                                        </div>
                                        <FormItem>
                                            <ButtonGroup mode="horizontal" gap="m" stretched>
                                                <Button onClick={handleFullfetchSchedule} size="l" stretched>
                                                    Полное расписание
                                                </Button>
                                                <Button onClick={handleCurrentfetchSchedule} size="l" stretched>
                                                    Текущее расписание
                                                </Button>
                                            </ButtonGroup>
                                        </FormItem>
                                    </Group>

                                    {schedule && ( // Если schedule не равно null, отображается блок с расписанием.
                                        <Group header={<Header mode="secondary">Расписание</Header>}>
                                            {schedule.error ? ( // Проверка на наличие ошибки в расписании. Если ошибки нет, отображаем расписание.
                                                <SimpleCell>{schedule.error}</SimpleCell>
                                            ) : (
                                                // Преобразуем объект расписания в массив и перебираем его. Расписание разбивается по ключам на группы и дни
                                                Object.entries(schedule).map(([day, lessons], index) => (
                                                    <Group header={<Header mode="primary">{day}</Header>} key={index}>
                                                        {/* Перебираем пары на день и фильтруем их в зависимости от четности недели */}
                                                        {Object.entries(lessons).map(([time, details], lessonIndex) => {
                                                            let filteredLessons = filterLessonsByWeek(details, isOddWeek);
                                                            if (viewType === 'current') {
                                                                if (filteredLessons.length > 0) {
                                                                    return (
                                                                        <SimpleCell key={lessonIndex}>
                                                                            <strong>{time}</strong>
                                                                            <SplitLayout>
                                                                                <Div style={{ width: '100vw' }}>
                                                                                    <Textarea readOnly>{filteredLessons[0]}</Textarea>
                                                                                </Div>
                                                                            </SplitLayout>
                                                                        </SimpleCell>
                                                                    );
                                                                }
                                                            } else {
                                                                return details.map((lesson, lessonIndex) => (
                                                                    <SimpleCell key={lessonIndex}>
                                                                        <strong>{time}</strong>
                                                                        <SplitLayout>
                                                                            <Div key={lessonIndex} style={{ width: '100vw' }}>
                                                                                <Textarea readOnly>{lesson}</Textarea>
                                                                            </Div>
                                                                        </SplitLayout>
                                                                    </SimpleCell>
                                                                ));
                                                            }
                                                        })}
                                                    </Group>
                                                ))
                                            )}
                                        </Group>
                                    )}
                                </Panel>
                            </View>
                        </SplitCol>
                    </SplitLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
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

const container = document.getElementById('root');
const root = createRoot(container); //
export default App;