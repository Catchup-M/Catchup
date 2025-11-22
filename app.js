// app.js
const { useState } = React;

// Icon Components (unchanged)
const Menu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const Search = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const X = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Users = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const UserPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" y1="8" x2="19" y2="14"></line>
    <line x1="22" y1="11" x2="16" y2="11"></line>
  </svg>
);

const Megaphone = () => (
  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 17.5C21 19.433 19.433 21 17.5 21C15.567 21 14 19.433 14 17.5C14 15.567 15.567 14 17.5 14C19.433 14 21 15.567 21 17.5Z" stroke="#6b7380" strokeWidth="1.5"></path>
    <path d="M2 11H22" stroke="#6b7380" strokeWidth="1.5" strokeLinecap="round"></path>
    <path d="M4 11L4.6138 8.54479C5.15947 6.36211 5.43231 5.27077 6.24609 4.63538C7.05988 4 8.1848 4 10.4347 4H13.5653C15.8152 4 16.9401 4 17.7539 4.63538C18.5677 5.27077 18.8405 6.36211 19.3862 8.54479L20 11" stroke="#6b7380" strokeWidth="1.5" strokeLinecap="round"></path>
    <path d="M10 17.5C10 19.433 8.433 21 6.5 21C4.567 21 3 19.433 3 17.5C3 15.567 4.567 14 6.5 14C8.433 14 10 15.567 10 17.5Z" stroke="#6b7380" strokeWidth="1.5"></path>
    <path d="M10 17.4999L10.6584 17.1707C11.5029 16.7484 12.4971 16.7484 13.3416 17.1707L14 17.4999" stroke="#6b7380" strokeWidth="1.5" strokeLinecap="round"></path>
  </svg>
);

function CatchupMessenger() {
  const [isLoggedIn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const conversations = [ /* ... same as before ... */ ];
  const contacts = [ /* ... same as before ... */ ];

  // ... all handlers same as before ...

  return (
    <div className="w-full h-screen bg-white flex flex-col relative overflow-hidden">
      {isLoggedIn ? (
        <>
          {/* Main Messages View */}
          <div className={isChatOpen ? 'slide-out-left' : ''}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 shadow-sm">
              <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Menu />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 absolute left-1/2 transform -translate-x-1/2">Messages</h1>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Search /></button>
            </div>

            {/* Conversation List - unchanged */}
            {/* ... */}
          </div>

          {/* Floating Action Button, Chat View, Full Screen Popup - unchanged */}
          {/* ... */}

          {/* Menu Overlay - now from menu.js */}
          <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        </>
      ) : null}
    </div>
  );
}

window.CatchupMessenger = CatchupMessenger;
