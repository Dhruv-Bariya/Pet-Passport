/**
 * App.jsx — Root component.
 * Wraps app in ThemeProvider + PetProvider.
 * Uses theme.mainBg for the main content area background.
 */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PetProvider }  from './context/PetContext';
import Sidebar          from './components/Sidebar';
import Dashboard        from './pages/Dashboard';
import DailyLogs        from './pages/DailyLogs';
import MedicalRecords   from './pages/MedicalRecords';
import Pets             from './pages/Pets';

function AppShell() {
  const { theme } = useTheme();
  return (
    <PetProvider>
      <BrowserRouter>
        <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
          <Sidebar />
          <main
            className="flex-1 overflow-y-auto min-h-screen pb-20 md:pb-0"
            style={{ background: theme.mainBg, transition: 'background 0.4s ease' }}
          >
            <Routes>
              <Route path="/"        element={<Dashboard />}      />
              <Route path="/logs"    element={<DailyLogs />}      />
              <Route path="/records" element={<MedicalRecords />} />
              <Route path="/pets"    element={<Pets />}           />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </PetProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
