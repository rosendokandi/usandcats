import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { StoryPage } from './pages/StoryPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { LoveNotesPage } from './pages/LoveNotesPage';
import { SettingsModal } from './components/SettingsModal';
import { AddMilestoneModal } from './components/AddMilestoneModal';
import { AddMemoryModal } from './components/AddMemoryModal';
import { ImageLightbox } from './components/ImageLightbox';

const MainContent: React.FC = () => {
  const { currentTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      
      {currentTab === 'home' && <HomePage />}
      {currentTab === 'story' && <StoryPage />}
      {currentTab === 'memories' && <MemoriesPage />}
      {currentTab === 'notes' && <LoveNotesPage />}

      <Footer />

      {/* Global Modals */}
      <SettingsModal />
      <AddMilestoneModal />
      <AddMemoryModal />
      <ImageLightbox />
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
