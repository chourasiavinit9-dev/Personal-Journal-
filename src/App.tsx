/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { AuthPage } from './components/AuthPage';
import { LifeOSProvider, useLifeOS } from './store/lifeOSStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SanctuaryHome } from './components/tabs/SanctuaryHome';
import { MemoriesVault } from './components/tabs/MemoriesVault';
import { HabitGarden } from './components/tabs/HabitGarden';
import { CityCrawlsPassport } from './components/tabs/CityCrawlsPassport';
import { JournalDesk } from './components/tabs/JournalDesk';
import { LockscreenView } from './components/tabs/LockscreenView';
import { YearWrapped } from './components/tabs/YearWrapped';
import { ZodiacCopilot } from './components/tabs/ZodiacCopilot';
import { NewTicketModal } from './components/NewTicketModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { TicketStub, TabType } from './types';
import { soundSynthesizer } from './utils/soundSynthesizer';

function LifeOSMain() {
  const [activeTab, setActiveTab] = useState<TabType>('sanctuary');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    tickets,
    heroTicket,
    habits,
    intentions,
    checkpoints,
    journalNotes,
    addTicket,
    updateHeroTicketImage,
    updateTicketImage,
    toggleHabit,
    toggleIntention,
    addIntention
  } = useLifeOS();

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateHeroTicketImage = (newImageUrl: string) => {
    updateHeroTicketImage(newImageUrl);
    showNotification('Personal photo updated on your Hero Memory Ticket!');
  };

  const handleUpdateTicketImage = (ticketId: string, newImageUrl: string) => {
    updateTicketImage(ticketId, newImageUrl);
    showNotification('Ticket photograph updated with your custom image!');
  };

  const handleToggleHabit = (id: string) => {
    const target = habits.find((h) => h.id === id);
    toggleHabit(id);
    if (target && !target.completedToday) {
      showNotification(`Ritual checked: "${target.title}" recorded in cadence ledger!`);
    }
  };

  const handleToggleIntention = (id: string) => {
    toggleIntention(id);
    const target = intentions.find((i) => i.id === id);
    if (target && !target.completed) {
      showNotification('Mindful intention fulfilled!');
    }
  };

  const handleAddIntention = (text: string) => {
    addIntention(text);
    showNotification(`Mindful intention recorded: "${text}"`);
  };

  const handleSaveNewTicket = (newStub: TicketStub) => {
    addTicket(newStub);
    showNotification(`Archived Memory Ticket #${newStub.stubNumber}: "${newStub.title}" into Box 04!`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1F1A17] flex flex-col font-sans selection:bg-[#E9BA6B]/30 selection:text-[#1F1A17]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none"
      >
        Skip to content
      </a>

      {/* Toast Notification for Tactile Operations */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="bg-[#1F1A17] text-[#F9F6F0] px-4 py-2.5 rounded-xl shadow-xl border border-[#D8CAB7] flex items-center gap-2.5 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#E9BA6B] animate-ping"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* If Lockscreen mode, show dedicated Lockscreen overlay */}
      {activeTab === 'lockscreen' ? (
        <div className="flex-1 flex flex-col justify-center items-center p-4 bg-[#14110E] min-h-screen">
          <div className="mb-2">
            <button
              onClick={() => setActiveTab('sanctuary')}
              className="text-xs font-mono text-[#D8CAB7] hover:text-white underline underline-offset-4 cursor-pointer"
            >
              ← Back to Sanctuary Desk
            </button>
          </div>
          <LockscreenView onUnlock={() => setActiveTab('sanctuary')} />
        </div>
      ) : (
        <>
          {/* Universal Tactile Header */}
          <Header
            activeTab={activeTab}
            setActiveTab={(tab) => setActiveTab(tab)}
            onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
            onOpenCommand={() => setIsCommandPaletteOpen(true)}
          />

          {/* Main Content Area */}
          <main id="main-content" tabIndex={-1} className="flex-1 py-4">
            {(activeTab === 'sanctuary' || (activeTab as string) === 'home') && (
              <SanctuaryHome
                heroTicket={heroTicket}
                intentions={intentions}
                onToggleIntention={handleToggleIntention}
                onAddIntention={handleAddIntention}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
                onUpdateHeroTicketImage={handleUpdateHeroTicketImage}
              />
            )}

            {activeTab === 'memories' && (
              <MemoriesVault
                tickets={tickets}
                heroTicket={heroTicket}
                onOpenNewTicket={() => setIsNewTicketModalOpen(true)}
                onUpdateHeroTicketImage={handleUpdateHeroTicketImage}
                onUpdateTicketImage={handleUpdateTicketImage}
              />
            )}

            {activeTab === 'habits' && (
              <HabitGarden habits={habits} onToggleHabit={handleToggleHabit} />
            )}

            {activeTab === 'crawls' && (
              <CityCrawlsPassport checkpoints={checkpoints} />
            )}

            {activeTab === 'journal' && (
              <JournalDesk notes={journalNotes} />
            )}

            {activeTab === 'wrapped' && <YearWrapped />}

            {activeTab === 'zodiac' && <ZodiacCopilot />}
          </main>

          {/* Universal Tactile Footer */}
          <Footer
            onExport={() => {
              soundSynthesizer.playStampSound();
              window.print();
            }}
          />

          {/* New Ticket Modal */}
          <NewTicketModal
            isOpen={isNewTicketModalOpen}
            onClose={() => setIsNewTicketModalOpen(false)}
            onSave={handleSaveNewTicket}
          />

          {/* Quick Command Palette Modal */}
          <CommandPaletteModal
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setIsCommandPaletteOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  // Loading state — Firebase is resolving auth from IndexedDB
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#14110E] flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#E9BA6B] animate-ping" />
      </div>
    );
  }

  // Not signed in — show Auth screen
  if (!user) {
    return <AuthPage onSignedIn={() => {}} />;
  }

  // Signed in — render full Life OS
  return (
    <LifeOSProvider>
      <LifeOSMain />
    </LifeOSProvider>
  );
}
