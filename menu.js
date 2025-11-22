// menu.js
const { useState } = React;

function MenuOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      {/* Menu Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Menu</h1>

        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      {/* Menu Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100 px-4 pt-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src="https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg" 
                alt="Admin"
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Admin</h2>
              <p className="text-sm text-gray-500">View your profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export to window so app.js can use it
window.MenuOverlay = MenuOverlay;
