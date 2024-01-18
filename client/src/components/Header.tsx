import React, { useCallback, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

interface HeaderProps {
  handleChange: (newValue: number) => void;
}

const Header: React.FC<HeaderProps> = ({ handleChange }) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = useCallback(
    (event: React.ChangeEvent<{}>, newValue: number) => {
      setSelectedTab(newValue);
      handleChange(newValue);
    },
    [handleChange],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Réservations" />
          <Tab label="Calendrier" />
        </Tabs>
      </Box>
    </Box>
  );
};

export default Header;
