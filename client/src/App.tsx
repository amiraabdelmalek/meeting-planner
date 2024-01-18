import React, { useCallback, useState } from 'react';
import './App.css';
import ReservationList from './components/ReservationList';
import Header from './components/Header';
import TabPanel from './components/TabPanel';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CalendarComp from './components/Calendar';

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = useCallback((newValue: number) => {
    setSelectedTab(newValue);
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: '#F2F2F2' }}>
        <Header handleChange={handleTabChange} />
        <TabPanel value={selectedTab} index={0}>
          <ReservationList />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <CalendarComp />
        </TabPanel>
      </div>
    </ThemeProvider>
  );
};

export default App;
