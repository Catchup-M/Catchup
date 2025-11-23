// chat.js - FINAL, FULLY FIXED VERSION (Send Arrow Animation Fixed)
const { useState, useRef, useEffect } = React;

const MessageBubble = ({ message, setReplyingTo, inputRef }) => {
  const [layout, setLayout] = useState('single');
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const swipeDirection = useRef(null);
  const bubbleRef = useRef(null);
  const textRef = useRef(null);
  const timeRef = useRef(null);

  useEffect(() => {
    if (textRef.current && timeRef.current) {
      const textWidth = textRef.current.offsetWidth;
      const timeWidth = timeRef.current.offsetWidth;
      const checkWidth = message.isOutgoing ? timeWidth + 20 : timeWidth;
      const totalWidth = textWidth + checkWidth + 24;

      if (totalWidth > 256) {
        setLayout('multi');
      } else {
        setLayout('single');
      }
    }
  }, [message.text]);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentX.current = e.touches[0].clientX;
    swipeDirection.current = null;
    setIsSwiping(false);
  };

  const handleTouchMove = (e) => {
    currentX.current = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    const diffX = currentX.current - startX.current;
    const diffY = currentY - startY.current;

    if (swipeDirection.current === null && (Math.abs(diffX) > 5 || Math.abs(diffY) > 5)) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        swipeDirection.current = 'horizontal';
      } else {
        swipeDirection.current = 'vertical';
      }
    }

    if (swipeDirection.current === 'horizontal') {
      e.preventDefault();
      setIsSwiping(true);

      if (message.isOutgoing && diffX < 0) {
        setSwipeX(Math.max(diffX, -80));
      } else if (!message.isOutgoing && diffX > 0) {
        setSwipeX(Math.min(diffX, 80));
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping || swipeDirection.current !== 'horizontal') {
      setSwipeX(0);
      setIsSwiping(false);
      swipeDirection.current = null;
      return;
    }

    setIsSwiping(false);
    swipeDirection.current = null;

    const shouldReply = Math.abs(swipeX) > 50;
    setSwipeX(0);

    if (shouldReply) {
      setReplyingTo(message);
    }
  };

  return (
    <div className={`flex items-end ${message.isOutgoing ? 'justify-end' : ''}`}>
      <div
        ref={bubbleRef}
        className="rounded-2xl px-4 py-2.5 max-w-xs"
        style={{
          backgroundColor: message.isOutgoing ? '#60a5fa' : '#f5f5f5',
          borderRadius: message.isOutgoing ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          transform: `translateX(${swipeX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
          willChange: 'transform'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {layout === 'single' ? (
          <div className="flex items-baseline gap-2">
            <span ref={textRef} style={{ color: message.isOutgoing ? '#ffffff' : '#000000', fontSize: '16px', lineHeight: '1' }}>
              {message.text}
            </span>
            <span ref={timeRef} className="flex items-center gap-1 flex-shrink-0" style={{ fontSize: '11px', lineHeight: '1', transform: 'translateY(3px)', color: message.isOutgoing ? '#dbeafe' : '#6b7280' }}>
              {message.time}
              {message.isOutgoing && (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                  <path d="M17.5821 6.95711C17.9726 6.56658 17.9726 5.93342 17.5821 5.54289C17.1916 5.15237 16.5584 5.15237 16.1679 5.54289L5.54545 16.1653L1.70711 12.327C1.31658 11.9365 0.683417 11.9365 0.292893 12.327C-0.0976311 12.7175 -0.097631 13.3507 0.292893 13.7412L4.83835 18.2866C5.22887 18.6772 5.86204 18.6772 6.25256 18.2866L17.5821 6.95711Z" fill="currentColor"></path>
                  <path d="M23.5821 6.95711C23.9726 6.56658 23.9726 5.93342 23.5821 5.54289C23.1915 5.15237 22.5584 5.15237 22.1678 5.54289L10.8383 16.8724C10.4478 17.263 10.4478 17.8961 10.8383 18.2866C11.2288 18.6772 11.862 18.6772 12.2525 18.2866L23.5821 6.95711Z" fill="currentColor"></path>
                </svg>
              )}
            </span>
          </div>
        ) : (
          <div>
            <div style={{ color: message.isOutgoing ? '#ffffff' : '#000000', fontSize: '16px', lineHeight: '1.5', wordBreak: 'break-word', paddingBottom: '4px' }}>
              <span ref={textRef} style={{ visibility: 'hidden', position: 'absolute' }}>{message.text}</span>
              {message.text}
            </div>
            <div className="flex items-center justify-end gap-1">
              <span ref={timeRef} style={{ fontSize: '11px', lineHeight: '1', color: message.isOutgoing ? '#dbeafe' : '#6b7280' }}>
                {message.time}
              </span>
              {message.isOutgoing && (
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14"
                  style={{ color: '#dbeafe' }} 
                >
                  <path d="M17.5821 6.95711C17.9726 6.56658 17.9726 5.93342 17.5821 5.54289C17.1916 5.15237 16.5584 5.15237 16.1679 5.54289L5.54545 16.1653L1.70711 12.327C1.31658 11.9365 0.683417 11.9365 0.292893 12.327C-0.0976311 12.7175 -0.097631 13.3507 0.292893 13.7412L4.83835 18.2866C5.22887 18.6772 5.86204 18.6772 6.25256 18.2866L17.5821 6.95711Z" fill="currentColor"></path>
                  <path d="M23.5821 6.95711C23.9726 6.56658 23.9726 5.93342 23.5821 5.54289C23.1915 5.15237 22.5584 5.15237 22.1678 5.54289L10.8383 16.8724C10.4478 17.263 10.4478 17.8961 10.8383 18.2866C11.2288 18.6772 11.862 18.6772 12.2525 18.2866L23.5821 6.95711Z" fill="currentColor"></path>
                </svg>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function ChatView({ selectedChat, onBack }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Afa', time: '07:00 AM', isOutgoing: false },
    { id: 2, text: 'Hello', time: '07:05 AM', isOutgoing: true }
  ]);
  const [showFloatingDate, setShowFloatingDate] = useState(false);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null); 
  const dateBadgeRef = useRef(null);
  const emojiPickerHeight = 300;

  const getScrollElement = () => chatContainerRef.current?.querySelector('.scroll-content');

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    let prevScrollHeight = scrollElement.scrollHeight;
    let fadeTimeout;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const scrolledFromBottom = scrollHeight - scrollTop - clientHeight;

      setHasScrolledUp(scrolledFromBottom > 100);

      if (dateBadgeRef.current) {
        const badgeRect = dateBadgeRef.current.getBoundingClientRect();
        const containerRect = scrollElement.getBoundingClientRect();
        const shouldShow = badgeRect.top < containerRect.top + 60;
        
        setShowFloatingDate(shouldShow);
        
        if (fadeTimeout) clearTimeout(fadeTimeout);
        
        if (shouldShow) {
          fadeTimeout = setTimeout(() => setShowFloatingDate(false), 2000);
        }
      }

      if (prevScrollHeight !== scrollHeight && scrolledFromBottom < 150) {
        requestAnimationFrame(() => scrollToBottom('auto'));
      }
      prevScrollHeight = scrollHeight;
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, []); 

  useEffect(() => { scrollToBottom('auto'); }, []);

  useEffect(() => {
    const handleResize = () => {
      // If the input is active, ensure scroll is maintained when visual viewport resizes (keyboard action)
      if (document.activeElement === inputRef.current) {
        setTimeout(() => scrollToBottom('smooth'), 100);
      }
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleFocus = () => {
    if (showEmojiPicker) setShowEmojiPicker(false);
    setTimeout(() => scrollToBottom('smooth'), 50);
  };

  // Ensure click outside doesn't dismiss the keyboard if the input is active.
  const handleClick = (e) => { 
    if (showEmojiPicker) {
      // Check if the click occurred on the input itself
      if (e.target !== inputRef.current) {
         setShowEmojiPicker(false); 
      }
    }
  };

  const handleSend = () => {
    const text = inputRef.current?.textContent?.trim();
    if (!text) return;

    const newMessage = {
      id: messages.length + 1,
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOutgoing: true
    };

    // 1. CLEAR CONTENT DIRECTLY to maintain current focus state.
    // The browser doesn't interpret this DOM manipulation as a focus loss.
    if (inputRef.current) {
      inputRef.current.textContent = '';
      inputRef.current.setAttribute('data-empty', 'true');
      
      // Manually reset cursor/selection to ensure cursor blinks at the start
      const selection = window.getSelection();
      const range = document.createRange();
      if (inputRef.current.firstChild) {
        range.setStart(inputRef.current.firstChild, 0);
      } else {
         range.setStart(inputRef.current, 0);
      }
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    // 2. Update React state (triggers re-render)
    setMessages([...messages, newMessage]);
    setReplyingTo(null);
    setHasText(false);
    
    // 3. Scroll to bottom after re-render completes
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
      if (target.textContent === '\n' || target.textContent === '') target.textContent = '';
    } else {
      target.removeAttribute('data-empty');
      setHasText(true);
    }

    if (!hasScrolledUp) setTimeout(() => scrollToBottom('auto'), 0);
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    const willOpen = !showEmojiPicker;
    setShowEmojiPicker(willOpen);
    
    if (willOpen) {
      setTimeout(() => {
        const scrollElement = getScrollElement();
        if (scrollElement) scrollElement.scrollTop = scrollElement.scrollHeight - scrollElement.clientHeight + emojiPickerHeight;
      }, 350);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col slide-in-right">
      {/* Header */}
      <div className="flex items-center px-3 py-2 bg-white shadow-md">
        <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div className="flex items-center ml-4 flex-1">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            <img src={selectedChat.avatarImage} alt={selectedChat.name} className="w-full h-full object-cover" draggable="false" />
          </div>
          <div className="ml-3">
            <h2 className="text-base font-semibold text-gray-900">{selectedChat.name}</h2>
            <p className="text-xs text-gray-500">{selectedChat.lastSeen}</p>
          </div>
        </div>
        <button className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Messages Area - Scrollbar hidden here */}
      <div ref={chatContainerRef} className="flex-1 px-4 bg-white flex flex-col" style={{ scrollBehavior: 'smooth', overflowX: 'hidden' }}>
        
        {/* Scrollable Wrapper with HIDE SCROLLBAR class and vendor prefixes */}
        <div 
          className="flex-1 overflow-y-auto flex flex-col scroll-content hide-scrollbar"
          style={{ 
            scrollbarWidth: 'none',     // Firefox
            msOverflowStyle: 'none'     // IE and Edge
          }}
        >

          {/* Floating Date Badge (Sticky to the top of the scrollable content) */}
          <div className="sticky top-0 z-10 flex justify-center transition-opacity duration-200 py-1" style={{ opacity: showFloatingDate ? 1 : 0, pointerEvents: 'none' }}>
            <div className="bg-black bg-opacity-70 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
              <span className="text-white text-sm font-medium">Today</span>
            </div>
          </div>
          
          {/* Main Content: This div grows to fill the container height when content is short */}
          <div className="flex flex-col flex-grow justify-end">
            <div ref={dateBadgeRef} className="flex justify-center my-4">
              <div className="bg-black bg-opacity-60 backdrop-blur-sm px-3 py-0.5 rounded-full">
                <span className="text-white text-sm">Today</span>
              </div>
            </div>

            <div className="space-y-3 pb-3">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} setReplyingTo={setReplyingTo} inputRef={inputRef} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Reply Bar */}
      {replyingTo && (
        <div className="bg-white px-4 py-2 flex-shrink-0">
          <div className="rounded-lg flex items-center justify-between py-2.5 pl-3 pr-3" style={{ backgroundColor: '#f5f5f5', borderLeft: '3px solid #3b82f6' }}>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-blue-500 mb-0.5">
                {replyingTo.isOutgoing ? 'You' : selectedChat.name}
              </div>
              <div className="text-sm text-gray-600 truncate">{replyingTo.text}</div>
            </div>
            {/* onMouseDown prevents focus theft */}
            <button 
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setReplyingTo(null);
              }} 
              className="ml-3 p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className={`bg-white flex-shrink-0 ${!replyingTo ? 'border-t border-gray-200' : ''}`}>
        <div className="w-full max-w-2xl mx-auto flex items-center p-2 gap-1">
          
          {/* Dynamic Emoji/Keyboard Button */}
          <button onClick={toggleEmojiPicker} className="p-2 flex-shrink-0 self-end">
            {showEmojiPicker ? (
              // KEYBOARD ICON (when picker is OPEN)
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 432 384">
                <path fill="#6b7280" d="M384 43q18 0 30.5 12.5T427 85v214q0 17-12.5 29.5T384 341H43q-18 0-30.5-12.5T0 299V85q0-17 12.5-29.5T43 43h341zm-192 64v42h43v-42h-43zm0 64v42h43v-42h-43zm-64-64v42h43v-42h-43zm0 64v42h43v-42h-43zm-21 42v-42H64v42h43zm0-64v-42H64v42h43zm192 150v-43H128v43h171zm0-86v-42h-43v42h43zm0-64v-42h-43v42h43zm64 64v-42h-43v42h43zm0-64v-42h-43v42h43z"/>
              </svg>
            ) : (
              // EMOJI ICON (when picker is CLOSED)
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="rotate(-19, 12, 12)">
                  <path d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"></path>
                  <ellipse cx="15" cy="10.5" rx="1" ry="1.5" fill="#6b7280"></ellipse>
                  <ellipse cx="9" cy="10.5" rx="1" ry="1.5" fill="#6b7280"></ellipse>
                  <path d="M15 22H12C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.9282 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12V15M15 22C18.866 22 22 18.866 22 15M15 22C15 20.1387 15 19.2081 15.2447 18.4549C15.7393 16.9327 16.9327 15.7393 18.4549 15.2447C19.2081 15 20.1387 15 22 15" stroke="#6b7280" strokeWidth="2"></path>
                </g>
              </svg>
            )}
          </button>

          <div
            ref={inputRef}
            contentEditable
            className="flex-1 bg-transparent text-gray-900 outline-none px-3 py-2 min-h-[24px] max-h-[120px] overflow-y-auto whitespace-pre-wrap break-words"
            style={{ minHeight: '24px', maxHeight: '120px' }}
            data-placeholder="Message..."
            data-empty="true"
            onFocus={handleFocus}
            onClick={handleClick}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            suppressContentEditableWarning={true}
          />

          {/* Attach Button (Pin) */}
          <button 
            onMouseDown={(e) => e.preventDefault()} // Prevents focus theft
            className="p-2 flex-shrink-0 self-end transition-opacity duration-200" 
            style={{ 
              opacity: hasText ? 0 : 1, 
              pointerEvents: hasText ? 'none' : 'auto'
              // Removed size/transform manipulation to keep position stable
            }}>
            <svg fill="#6b7280" viewBox="0 0 32 32" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="rotate(-42, 16, 16)">
                <path d="M13.17,29.9a4,4,0,0,1-2.83-1.17L4.69,23.07a4,4,0,0,1,0-5.66L18.83,3.27a4.1,4.1,0,0,1,5.66,0L27.31,6.1a4,4,0,0,1,0,5.66L16,23.07a4,4,0,0,1-5.66-5.66l9.2-9.19L21,9.64l-9.19,9.19a2,2,0,0,0,2.83,2.83L25.9,10.34a2,2,0,0,0,0-2.83L23.07,4.69a2,2,0,0,0-2.83,0L6.1,18.83a2,2,0,0,0,0,2.83l5.66,5.65a2,2,0,0,0,2.83,0l12-12L28,16.71l-12,12A4,4,0,0,1,13.17,29.9Z"></path>
              </g>
            </svg>
          </button>

          {/* Camera Button */}
          <button 
            onMouseDown={(e) => e.preventDefault()} // Prevents focus theft
            className="p-2 flex-shrink-0 self-end transition-opacity duration-200" 
            style={{ 
              opacity: hasText ? 0 : 1, 
              pointerEvents: hasText ? 'none' : 'auto'
              // Removed size/transform manipulation to keep position stable
            }}>
            <svg viewBox="0 0 24 24" fill="none" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              {/* Stroke color manually set to match existing icons' gray (#6b7280) */}
              <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="#6b7280" strokeWidth="1.5"></path> 
              <circle cx="12" cy="12" r="4" stroke="#6b7280" strokeWidth="1.5"></circle> 
            </svg>
          </button>

          {/* Microphone Button (Voice) */}
          <button 
            onMouseDown={(e) => e.preventDefault()} // Prevents focus theft
            className="p-2 flex-shrink-0 self-end hover:bg-gray-100 rounded-full transition-opacity duration-200" 
            style={{ 
              opacity: hasText ? 0 : 1, 
              pointerEvents: hasText ? 'none' : 'auto' 
              // Removed size/transform manipulation to keep position stable
            }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="2" width="8" height="13" rx="4"></rect>
              <path d="M20,10v1a8,8,0,0,1-8,8h0a8,8,0,0,1-8-8V10"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </button>

          {/* Send Button - Fixed to disappear cleanly without translation */}
          <button 
            onClick={handleSend} 
            className="p-2 flex-shrink-0 self-end transition-all duration-200" 
            style={{ 
              opacity: hasText ? 1 : 0, 
              pointerEvents: hasText ? 'auto' : 'none', 
              // Control visibility and space by changing width and padding
              width: hasText ? 'auto' : 0, 
              padding: hasText ? '0.5rem' : '0' 
            }}>
            <svg viewBox="0 -0.5 21 21" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.61258 9L0.05132 1.31623C-0.22718 0.48074 0.63218 -0.28074 1.42809 0.09626L20.4281 9.0963C21.1906 9.4575 21.1906 10.5425 20.4281 10.9037L1.42809 19.9037C0.63218 20.2807 -0.22718 19.5193 0.05132 18.6838L2.61258 11H8.9873C9.5396 11 9.9873 10.5523 9.9873 10C9.9873 9.4477 9.5396 9 8.9873 9H2.61258z" fill="#3b82f6" fillRule="evenodd" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Empty Emoji Picker */}
      <div className="bg-gray-100 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out" style={{ height: showEmojiPicker ? emojiPickerHeight : 0 }}>
        <div className="w-full max-w-2xl mx-auto h-full p-4">
          <div className="grid grid-cols-8 gap-2"></div>
        </div>
      </div>
    </div>
  );
}

window.ChatView = ChatView;
window.MessageBubble = MessageBubble;

