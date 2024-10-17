import logo from './logo.svg';
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
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

function App() {
  return (
    <AppRoot>
      <View activePanel="main">
        <Panel id='main'>
          <PanelHeader>SUAI schedule</PanelHeader>
          <Group mode='card' header={<Header mode='secondary'>
            Выбери свою группу
          </Header>}></Group>
        </Panel>
      </View>
    </AppRoot>
  );
}

export default App;
