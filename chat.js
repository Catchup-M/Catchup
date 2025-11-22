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

  // === PREVENT ANY HORIZONTAL BOUNCE / SCROLL ON MOBILE ===
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    document.body.style.overscrollBehaviorX = 'none';
    return () => {
      document.body.style.overflowX = '';
      document.body.style.overscrollBehaviorX = '';
    };
  }, []);

  // === VISUAL VIEWPORT HANDLING (keyboard open/close) ===
  useEffect(() => {
    const handleViewport = () => {
      if (document.activeElement === inputRef.current) {
        setTimeout(() => scrollToBottom('smooth'), 150);
      }
    };

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', handleViewport);
      vv.addEventListener('scroll', handleViewport);
      return () => {
        vv.removeEventListener('resize', handleViewport);
        vv.removeEventListener('scroll', handleViewport);
      };
    }
  }, []);

  // === CHAT SCROLL LOGIC ===
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    let prevScrollHeight = container.scrollHeight;
    let fadeTimeout;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const fromBottom = scrollHeight - scrollTop - clientHeight;
      setHasScrolledUp(fromBottom > 100);

      // Floating date logic
      if (dateBadgeRef.current) {
        const badgeRect = dateBadgeRef.current.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const shouldShow = badgeRect.top < containerRect.top + 60;
        setShowFloatingDate(shouldShow);

        if (fadeTimeout) clearTimeout(fadeTimeout);
        if (shouldShow) {
          fadeTimeout = setTimeout(() => setShowFloatingDate(false), 2000);
        }
      }

      // Auto-scroll when new message arrives near bottom
      if (prevScrollHeight !== scrollHeight && fromBottom < 150) {
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
    setTimeout(() => scrollToBottom('smooth'), 300);
  };

  const handleSend = () => {
    const text = inputRef.current?.textContent?.trim();
    if (!text) return;

    const newMsg = {
      id: messages.length + 1,
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOutgoing: true
    };

    setMessages(prev => [...prev, newMsg]);
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
    const text = e.target.textContent || '';
    const empty = text.trim() === '';
    setHasText(!empty);
    e.target.setAttribute('data-empty', empty ? 'true' : 'false');

    if (!hasScrolledUp) {
      setTimeout(() => scrollToBottom('auto'), 0);
    }
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    setShowEmojiPicker(prev => !prev);
  };

  useEffect(() => scrollToBottom('auto'), []);

  // =============================================
  // MESSAGE BUBBLE (100% UNCHANGED)
  // =============================================
  const MessageBubble = ({ message }) => {
    const [layout, setLayout] = useState('single');
    const [swipeX, setSwipeX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startX = useRef(0);
    const bubbleRef = useRef(null);
    const textRef = useRef(null);
    const timeRef = useRef(null);

    useEffect(() => {
      if (textRef.current && timeRef.current) {
        const total = textRef.current.offsetWidth + timeRef.current.offsetWidth + 44;
        setLayout(total > 256 ? 'multi' : 'single');
      }
    }, [message.text]);

    const touchStart = (e) => {
      startX.current = e.touches[0].clientX;
    };

    const touchMove = (e) => {
      const diff = e.touches[0].clientX - startX.current;
      if (Math.abs(diff) < 10) return;

      e.preventDefault();
      setIsSwiping(true);

      if (message.isOutgoing && diff < 0) setSwipeX(Math.max(diff, -80));
      if (!message.isOutgoing && diff > 0) setSwipeX(Math.min(diff, 80));
    };

    const touchEnd = () => {
      if (isSwiping && Math.abs(swipeX) > 50) {
        setReplyingTo(message);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      setSwipeX(0);
      setIsSwiping(false);
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
          }}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
        >
          {layout === 'single' ? (
            <div className="flex items-baseline gap-2">
              <span ref={textRef} className="text-white text-base">{message.text}</span>
              <span ref={timeRef} className="text-[11px] text-sky-100 flex items-center gap-1">
                {message.time}
                {message.isOutgoing && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5821 6.95711C17.9726 6.56658... (your checkmark SVG)"/></svg>
                )}
              </span>
            </div>
          ) : (
            // multi-line version unchanged
            // ... (keep exactly as you had it)
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* FULLSCREEN CHAT - NO HORIZONTAL SCROLL EVER */}
      <div className="fixed inset-0 flex flex-col bg-white overflow-hidden overscroll-none" style={{ overscrollBehavior: 'none' }}>
        
        {/* GPU ACCELERATED WRAPPER - prevents flicker & horizontal bounce */}
        <div className="flex-1 flex flex-col" style={{ transform: 'translateZ(0)' }}>

          {/* HEADER - FIXED */}
          <div className="flex items-center justify-between px-3 py-2 flex-shrink-0 bg-white border-b border-gray-200 z-10">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>
            </button>

            <div className="flex items-center flex-1 ml-2 min-w-0">
              <img src="https://i.ibb.co/C5b875C6/Screenshot-20250904-050841.jpg" alt="VaVia" className="w-11 h-11 rounded-full object-cover" />
              <div className="ml-3 flex-1 min-w-0">
                <h1 className="text-base font-semibold truncate">VaVia</h1>
                <p className="text-xs text-gray-500 truncate">last seen Nov 3 at 02:18 AM</p>
              </div>
            </div>

            <button className="p-2 hover:bg-gray-200 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>

          {/* MESSAGES - ONLY THIS SCROLLS */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden px-4 bg-white"
            style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'none' }}
          >
            <div className="flex flex-col justify-end min-h-full space-y-4 py-2">

              <div className={`sticky top-0 z-10 flex justify-center py-1 transition-opacity ${showFloatingDate ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
                <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-sm">June 6</span>
                </div>
              </div>

              <div ref={dateBadgeRef} className="flex justify-center">
                <div className="bg-black/60 backdrop-blur-sm px-3 py-0.5 rounded-full text-white text-sm">June 6</div>
              </div>

              {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* REPLY BAR */}
        {replyingTo && (
          <div className="bg-white px-4 py-2 border-t border-gray-200 flex-shrink-0">
            <div className="bg-gray-100 rounded-lg px-3 py-2.5 flex items-center justify-between border-l-4 border-blue-500">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-blue-500">{replyingTo.isOutgoing ? 'You' : 'VaVia'}</div>
                <div className="text-sm text-gray-600 truncate">{replyingTo.text}</div>
              </div>
              <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-gray-300 rounded-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* INPUT + EMOJI PICKER */}
        <div className="bg-white border-t border-gray-200 flex-shrink-0" style={{ overscrollBehavior: 'none' }}>
          <div className="flex items-end p-2 gap-1">
            <button onClick={toggleEmojiPicker} className="p-2">
              {/* emoji icon */}
            </button>

            <div
              ref={inputRef}
              contentEditable
              className="flex-1 bg-transparent outline-none px-3 py-2 min-h-[40px] max-h-[120px] overflow-y-auto whitespace-pre-wrap break-words text-gray-900"
              data-placeholder="Message..."
              data-empty="true"
              onFocus={handleFocus}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              suppressContentEditableWarning={true}
            />

            {/* attach / mic / send buttons (same as before) */}
            {/* ... */}

            <button onClick={handleSend} className="p-2" style={{ opacity: hasText ? 1 : 0, pointerEvents: hasText ? 'auto' : 'none' }}>
              <svg viewBox="0 -0.5 21 21" width="24" height="24" fill="#3b82f6"> {/* send icon */}</svg>
            </button>
          </div>

          {/* EMOJI PICKER */}
          <div
            className="overflow-hidden bg-gray-100 border-t border-gray-200 transition-all duration-300"
            style={{ height: showEmojiPicker ? `${emojiPickerHeight}px` : 0 }}
          >
            <div className="h-full p-4 text-center text-sm text-gray-500">
              Emoji picker placeholder
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL STYLES - CRITICAL FOR MOBILE */}
      <style jsx global>{`
        html, body { overscroll-behavior-x: none; overflow-x: hidden; }
        body { position: fixed; width: 100%; }
        [contenteditable][data-placeholder][data-empty="true"]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          position: absolute;
          pointer-events: none;
        }
        [contenteditable]:empty { min-height: 40px; display: flex; align-items: center; }
      `}</style>
    </>
  );
}
