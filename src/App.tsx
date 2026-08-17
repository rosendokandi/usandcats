import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
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

const MainContent: React.FC = () => {
  const { currentTab } = useApp();

  // If on standalone Gate page, render the full Gate Screen
  if (currentTab === 'gate') {
    return (
      <div className="min-h-screen flex flex-col justify-between relative">
        <GatePage />
        <RealtimeToast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      <Header />
      
      {currentTab === 'home' && <HomePage />}
      {currentTab === 'story' && <StoryPage />}
      {currentTab === 'memories' && <MemoriesPage />}
      {currentTab === 'notes' && <LoveNotesPage />}

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

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
