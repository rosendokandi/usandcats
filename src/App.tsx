import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import { ConfirmModal } from './components/ConfirmModal';
import { MobileDrawer } from './components/MobileDrawer';

// Layout wrapper for authenticated romantic space (includes Header & Footer)
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />

      {/* Global Modals, Drawer & Live Notification */}
      <MobileDrawer />
      <SettingsModal />
      <AddMilestoneModal />
      <AddMemoryModal />
      <ImageLightbox />
      <RoomModal />
      <RealtimeToast />
    </div>
  );
};

// 🔒 Strict Route Guard: Forces redirection to /gate if not authenticated in a room!
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentRoom } = useApp();

  if (!currentRoom) {
    return <Navigate to="/gate" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// Root index redirector
const RootRedirector: React.FC = () => {
  const { currentRoom } = useApp();
  return currentRoom ? <Navigate to="/home" replace /> : <Navigate to="/gate" replace />;
};

// Global confirm dialog handler
const GlobalConfirmHandler: React.FC = () => {
  const navigate = useNavigate();
  const { isExitModalOpen, setIsExitModalOpen, exitRoom, currentRoom } = useApp();

  return (
    <ConfirmModal
      isOpen={isExitModalOpen}
      onClose={() => setIsExitModalOpen(false)}
      onConfirm={() => {
        exitRoom();
        navigate('/gate');
      }}
      title={`确认退出房间【${currentRoom?.roomId || ''}】？`}
      message="退出后将彻底清空当前会话中的所有私密故事、相册与情书数据，并断开云端同步。任何人均无法查看您的隐私，下次进入需重新输入房间暗号与密码。"
      confirmText="确认安全退出"
      cancelText="取消"
    />
  );
};

// Root router with route definitions
const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public Standalone Gate / Room Entrance Routes */}
        <Route path="/gate" element={<GatePage />} />
        <Route path="/room/:roomId" element={<GatePage />} />

        {/* Root Path: Redirects to /gate if not logged in */}
        <Route path="/" element={<RootRedirector />} />

        {/* 🔒 Protected Romantic Space Routes (Strictly requires room passcode) */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/story" element={<ProtectedRoute><StoryPage /></ProtectedRoute>} />
        <Route path="/memories" element={<ProtectedRoute><MemoriesPage /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><LoveNotesPage /></ProtectedRoute>} />

        {/* Catch-all fallback: redirect to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <GlobalConfirmHandler />
    </>
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
