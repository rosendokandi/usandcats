import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GatePage } from './pages/GatePage';
import { HomePage } from './pages/HomePage';
import { StoryPage } from './pages/StoryPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { LoveNotesPage } from './pages/LoveNotesPage';
import { SettingsModal } from './components/SettingsModal';
import { AddMilestoneModal } from './components/AddMilestoneModal';
import { AddMemoryModal } from './components/AddMemoryModal';
import { ImageLightbox } from './components/ImageLightbox';
import { RoomModal } from './components/RoomModal';
import { RealtimeToast } from './components/RealtimeToast';

// Layout wrapper for standard pages (includes Header & Footer)
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />

      {/* Global Modals & Live Notification */}
      <SettingsModal />
      <AddMilestoneModal />
      <AddMemoryModal />
      <ImageLightbox />
      <RoomModal />
      <RealtimeToast />
    </div>
  );
};

// Root router with route definitions
const AppRoutes: React.FC = () => {
  const location = useLocation();

  // If first time visiting root "/" and no room saved, can still show home or gate
  return (
    <Routes location={location}>
      {/* Standalone Gate / Room Entrance Routes */}
      <Route path="/gate" element={<GatePage />} />
      <Route path="/room/:roomId" element={<GatePage />} />

      {/* Standard Romantic Space Routes */}
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/home" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/story" element={<AppLayout><StoryPage /></AppLayout>} />
      <Route path="/memories" element={<AppLayout><MemoriesPage /></AppLayout>} />
      <Route path="/notes" element={<AppLayout><LoveNotesPage /></AppLayout>} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
