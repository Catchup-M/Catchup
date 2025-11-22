const { useState, useRef, useEffect } = React;

function CatchupChat({ onBack }) {
  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFloatingDate, setShowFloatingDate] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Afa', time: '07:00 AM', isOutgoing: false },
    { id: 2, text: 'Hello', time: '07:05 AM', isOutgoing: true }
  ]);
  const emojiPickerHeight = 300;
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const dateBadgeRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    const dateBadge = dateBadgeRef.current;
    if (!container) return;

    let prevScrollHeight = container.scrollHeight;
    let fadeTimeout;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrolledFromBottom = scrollHeight - scrollTop - clientHeight;

      setHasScrolledUp(scrolledFromBottom > 100);

      if (dateBadge) {
        const badgeRect = dateBadge.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const shouldShow = badgeRect.top < containerRect.top + 60;
        
        setShowFloatingDate(shouldShow);
        
        if (fadeTimeout) clearTimeout(fadeTimeout);
        
        if (shouldShow) {
        fadeTimeout = setTimeout(() => {
          setShowFloatingDate(false);
        }, 2000);
        }
      }

      if (prevScrollHeight !== scrollHeight && scrolledFromBottom < 150) {
        requestAnimationFrame(() => scrollToBottom('auto'));
      }
      prevScrollHeight = scrollHeight;
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, []);

  const handleFocus = () => {
    if (showEmojiPicker) setShowEmojiPicker(false);
    setTimeout(() => scrollToBottom('smooth'), 300); // increased delay for keyboard
  };

  const handleClick = () => {
    if (showEmojiPicker) setShowEmojiPicker(false);
  };

  const handleSend = () => {
    const text = inputRef.current?.textContent?.trim();
    if (!text) return;

    const newMessage = {
      id: messages.length + 1,
      text: text,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOutgoing: true
    };

    setMessages(prev => [...prev, newMessage]);
    setReplyingTo(null);
    
    if (inputRef.current) {
      inputRef.current.textContent = '';
      inputRef.current.setAttribute('data-empty', 'true');
      setHasText(false);
    }

    setTimeout(() => scrollToBottom('smooth'), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    const target = e.target;
    const text = target.innerText || target.textContent || '';
    const isEmpty = text.trim() === '' || text === '\n';
    
    if (isEmpty) {
      target.setAttribute('data-empty', 'true');
      setHasText(false);
      if (target.textContent === '\n' || target.textContent === '') {
        target.textContent = '';
      }
    } else {
      target.removeAttribute('data-empty');
      setHasText(true);
    }

    if (!hasScrolledUp) {
      setTimeout(() => scrollToBottom('auto'), 0);
    }
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    const willOpen = !showEmojiPicker;
    setShowEmojiPicker(willOpen);
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  // Handle keyboard resize properly
  useEffect(() => {
    const handleResize = () => {
      if (document.activeElement === inputRef.current) {
        setTimeout(() => scrollToBottom('smooth'), 300);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  return (
    <>
      {/* IMPORTANT: Add this meta tag to your <head> for proper mobile behavior */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" /> */}

      <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-3 py-2 flex-shrink-0 bg-white z-50 border-b border-gray-200">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors z-50"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
          </button>

          <div className="flex items-center flex-1 ml-2 min-w-0">
            <img src="https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg" alt="VaVia" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
            <div className="ml-3 flex-1 min-w-0">
              <h1 className="text-base font-semibold text-gray-900 leading-tight truncate">VaVia</h1>
              <p className="text-xs text-gray-500 leading-tight truncate">last seen Nov 3 at 02:18 AM</p>
            </div>
          </div>

          <button className="p-2 -mr-2 hover:bg-gray-200 rounded-full transition-colors bg-gray-100 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Scrollable Messages Area Only */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden px-4 bg-white"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex flex-col justify-end min-h-full space-y-4 py-2">
            <div className="sticky top-0 z-10 flex justify-center pt-2">
              <div 
                className="bg-black bg-opacity-70 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg transition-opacity duration-300"
                style={{ opacity: showFloatingDate ? 1 : 0 }}
              >
                <span className="text-white text-sm font-medium">June 6</span>
              </div>
            </div>

            <div ref={dateBadgeRef} className="flex justify-center">
              <div className="bg-black bg-opacity-60 backdrop-blur-sm px-3 py-0.5 rounded-full">
                <span className="text-white text-sm">June 6</span>
              </div>
            </div>

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Reply Bar */}
        {replyingTo && (
          <div className="bg-white px-4 py-2 flex-shrink-0 border-t border-gray-200">
            <div className="rounded-lg flex items-center justify-between py-2.5 pl-3 pr-3 bg-gray-50 border-l-4 border-blue-500">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-blue-500 mb-0.5">
                  {replyingTo.isOutgoing ? 'You' : 'VaVia'}
                </div>
                <div className="text-sm text-gray-600 truncate">{replyingTo.text}</div>
              </div>
              <button onClick={() => setReplyingTo(null)} className="ml-3 p-1 hover:bg-gray-200 rounded-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
        )}

        {/* Fixed Input + Emoji Picker */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200">
          <div className="flex items-end p-2 gap-1">
            <button onClick={toggleEmojiPicker} className="p-2 flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="rotate(-19, 12, 12)">
                  <path d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"></path>
                  <ellipse cx="15" cy="10.5" rx="1" ry="1.5" fill="#6b7280"></ellipse>
                  <ellipse cx="9" cy="10.5" rx="1" ry="1.5" fill="#6b7280"></ellipse>
                  <path d="M15 22H12C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12V15M15 22C18.866 22 22 18.866 22 15M15 22C15 20.1387 15 19.2081 15.2447 18.4549C15.7393 16.9327 16.9327 15.7393 18.4549 15.2447C19.2081 15 20.1387 15 22 15" stroke="#6b7280" strokeWidth="2"></path>
                </g>
              </svg>
            </button>

            <div
              ref={inputRef}
              contentEditable
              className="flex-1 bg-gray-100 rounded-2xl text-gray-900 outline-none px-4 py-2.5 min-h-[40px] max-h-[120px] overflow-y-auto whitespace-pre-wrap break-words"
              data-placeholder="Message..."
              data-empty="true"
              onFocus={handleFocus}
              onClick={handleClick}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              suppressContentEditableWarning={true}
            />

            {/* Attach & Voice buttons (hidden when typing) */}
            <button className={`p-2 flex-shrink-0 transition-all duration-200 ${hasText ? 'opacity-0 w-0 p-0 overflow-hidden' : 'opacity-100'}`}>
              <svg fill="#6b7280" viewBox="0 0 32 32" width="24" height="24"><g transform="rotate(-42, 16, 16)"><path d="M13.17,29.9a4,4,0,0,1-2.83-1.17L4.69,23.07a4,4,0,0,1,0-5.66L18.83,3.27a4.1,4.1,0,0,1,5.66,0L27.31,6.1a4,4,0,0,1,0,5.66L16,23.07a4,4,0,0,1-5.66-5.66l9.2-9.19L21,9.64l-9.19,9.19a2,2,0,0,0,2.83,2.83L25.9,10.34a2,2,0,0,0,0-2.83L23.07,4.69a2,2,0,0,0-2.83,0L6.1,18.83a2,2,0,0,0,0,2.83l5.66,5.65a2,2,0,0,0,2.83,0l12-12L28,16.71l-12,12A4,4,0,0,1,13.17,29.9Z"></path></g></svg>
            </button>

            <button className={`p-2 flex-shrink-0 transition-all duration-200 ${hasText ? 'opacity-0 w-0 p-0 overflow-hidden' : 'opacity-100'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" width="24" height="24"><rect x="8" y="2" width="8" height="13" rx="4"></rect><path d="M20,10v1a8,8,0,0,1-8,8h0a8,8,0,0,1-8-8V10"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
            </button>

            {/* Send button (shown only when typing) */}
            <button 
              onClick={handleSend}
              className={`p-2 flex-shrink-0 transition-all duration-200 ${hasText ? 'opacity-100' : 'opacity-0 w-0 p-0 overflow-hidden'}`}
            >
              <svg viewBox="0 -0.5 21 21" width="24" height="24" fill="#3b82f6"><path d="M2.61258 9L0.05132 1.31623C-0.22718 0.48074 0.63218 -0.28074 1.42809 0.09626L20.4281 9.0963C21.1906 9.4575 21.1906 10.5425 20.4281 10.9037L1.42809 19.9037C0.63218 20.2807 -0.22718 19.5193 0.05132 18.6838L2.61258 11H8.9873C9.5396 11 9.9873 10.5523 9.9873 10C9.9873 9.4477 9.5396 9 8.9873 9H2.61258z" /></svg>
            </button>
          </div>

          {/* Emoji Picker */}
          <div 
            className="overflow-hidden transition-all duration-300 ease-in-out bg-gray-100 border-t border-gray-200"
            style={{ height: showEmojiPicker ? `${emojiPickerHeight}px` : '0px' }}
          >
            <div className="h-full p-4 text-center text-gray-500 text-sm">
              Emoji picker placeholder
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        [contenteditable][data-placeholder][data-empty="true"]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          opacity: 1;
        }
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
        [contenteditable]:focus:before {
          content: none !important;
        }
      `}</style>
    </>
  );
}

// Your MessageBubble component stays 100% unchanged
const MessageBubble = /* ... your existing MessageBubble code ... */;
