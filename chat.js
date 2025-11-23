// chat.js
const { useState, useRef, useEffect } = React;

const MessageBubble = ({ message, setReplyingTo, inputRef }) => {
  const [layout, setLayout] = useState('single');
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const bubbleRef = useRef(null);
  const textRef = useRef(null);
  const timeRef = useRef(null);

  useEffect(() => {
    if (textRef.current && timeRef.current) {
      const totalWidth = textRef.current.offsetWidth + timeRef.current.offsetWidth + (message.isOutgoing ? 40 : 20);
      setLayout(totalWidth > 256 ? 'multi' : 'single');
    }
  }, [message.text]);

  const handleTouchStart = e => { startX.current = e.touches[0].clientX; setIsSwiping(false); };
  const handleTouchMove = e => {
    const diffX = e.touches[0].clientX - startX.current;
    if (Math.abs(diffX) > 5) e.preventDefault();
    if (message.isOutgoing && diffX < 0) setSwipeX(Math.max(diffX, -80));
    if (!message.isOutgoing && diffX > 0) setSwipeX(Math.min(diffX, 80));
    setIsSwiping(true);
  };
  const handleTouchEnd = () => {
    if (isSwiping && Math.abs(swipeX) > 50) {
      setReplyingTo(message);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    setSwipeX(0); setIsSwiping(false);
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
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {layout === 'single' ? (
          <div className="flex items-baseline gap-2">
            <span ref={textRef} style={{ color: message.isOutgoing ? '#fff' : '#000', fontSize:'16px' }}>{message.text}</span>
            <span ref={timeRef} style={{ fontSize:'11px', color: message.isOutgoing ? '#dbeafe' : '#6b7280' }}>
              {message.time}
              {message.isOutgoing && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5821 6.95711C17.9726 6.56658 17.9726 5.93342 17.5821 5.54289C17.1916 5.15237 16.5584 5.15237 16.1679 5.54289L5.54545 16.1653L1.70711 12.327C1.31658 11.9365 0.683417 11.9365 0.292893 12.327C-0.0976311 12.7175 -0.097631 13.3507 0.292893 13.7412L4.83835 18.2866C5.22887 18.6772 5.86204 18.6772 6.25256 18.2866L17.5821 6.95711Z" fill="currentColor"/>
                  <path d="M23.5821 6.95711C23.9726 6.56658 23.9726 5.93342 23.5821 5.54289C23.1915 5.15237 22.5584 5.15237 22.1678 5.54289L10.8383 16.8724C10.4478 17.263 10.4478 17.8961 10.8383 18.2866C11.2288 18.6772 11.862 18.6772 12.2525 18.2866L23.5821 6.95711Z" fill="currentColor"/>
                </svg>
              )}
            </span>
          </div>
        ) : (
          <div>
            <div style={{ color: message.isOutgoing ? '#fff' : '#000', fontSize:'16px', lineHeight:'1.5', wordBreak:'break-word', paddingBottom:'4px' }}>
              <span ref={textRef} style={{visibility:'hidden',position:'absolute'}}>{message.text}</span>
              {message.text}
            </div>
            <div className="flex items-center justify-end gap-1">
              <span ref={timeRef} style={{ fontSize:'11px', color: message.isOutgoing ? '#dbeafe' : '#6b7280' }}>{message.time}</span>
              {message.isOutgoing && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{color:'#dbeafe'}}>
                  <path d="M17.5821 6.95711C17.9726 6.56658 17.9726 5.93342 17.5821 5.54289C17.1916 5.15237 16.5584 5.15237 16.1679 5.54289L5.54545 16.1653L1.70711 12.327C1.31658 11.9365 0.683417 11.9365 0.292893 12.327C-0.0976311 12.7175 -0.097631 13.3507 0.292893 13.7412L4.83835 18.2866C5.22887 18.6772 5.86204 18.6772 6.25256 18.2866L17.5821 6.95711Z" fill="currentColor"/>
                  <path d="M23.5821 6.95711C23.9726 6.56658 23.9726 5.93342 23.5821 5.54289C23.1915 5.15237 22.5584 5.15237 22.1678 5.54289L10.8383 16.8724C10.4478 17.263 10.4478 17.8961 10.8383 18.2866C11.2288 18.6772 11.862 18.6772 12.2525 18.2866L23.5821 6.95711Z" fill="currentColor"/>
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

  const scrollToBottom = (b = 'smooth') => messagesEndRef.current?.scrollIntoView({ behavior: b });

  // Prevent bounce & glow on short chats
  useEffect(() => {
    const c = chatContainerRef.current;
    if (!c) return;
    const block = e => {
      if ((c.scrollTop === 0 && e.deltaY < 0) || (c.scrollHeight - c.scrollTop - c.clientHeight < 1 && e.deltaY > 0)) e.preventDefault();
    };
    c.addEventListener('wheel', block, { passive: false });
    return () => c.removeEventListener('wheel', block);
  }, []);

  // Normal scroll handling
  useEffect(() => {
    const c = chatContainerRef.current;
    if (!c) return;
    let prevH = c.scrollHeight, timeout;
    const handler = () => {
      const fromBottom = c.scrollHeight - c.scrollTop - c.clientHeight;
      setHasScrolledUp(fromBottom > 100);
      if (dateBadgeRef.current) {
        const show = dateBadgeRef.current.getBoundingClientRect().top < 80;
        setShowFloatingDate(show);
        clearTimeout(timeout);
        if (show) timeout = setTimeout(() => setShowFloatingDate(false), 2000);
      }
      if (prevH !== c.scrollHeight && fromBottom < 150) scrollToBottom('auto');
      prevH = c.scrollHeight;
    };
    c.addEventListener('scroll', handler);
    return () => { c.removeEventListener('scroll', handler); clearTimeout(timeout); };
  }, []);

  useEffect(() => scrollToBottom('auto'), []);

  // Keyboard show/hide handling
  useEffect(() => {
    const resize = () => document.activeElement === inputRef.current && setTimeout(() => scrollToBottom(), 100);
    window.visualViewport?.addEventListener('resize', resize) || window.addEventListener('resize', resize);
    return () => (window.visualViewport?.removeEventListener('resize', resize) || window.removeEventListener('resize', resize));
  }, []);

  const send = () => {
    const txt = inputRef.current?.textContent?.trim();
    if (!txt) return;
    setMessages(m => [...m, { id: m.length + 1, text: txt, time: new Date().toLocaleTimeString('en-US', {hour:'numeric',minute:'2-digit'}), isOutgoing: true }]);
    setReplyingTo(null);
    inputRef.current.textContent = ''; inputRef.current.setAttribute('data-empty','true'); setHasText(false);
    setTimeout(() => scrollToBottom(), 100);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col slide-in-right">
      {/* Header */}
      <div className="flex items-center px-3 py-2 bg-white shadow-md">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg></button>
        <div className="flex items-center ml-4 flex-1">
          <div className="w-9 h-9 rounded-full overflow-hidden"><img src={selectedChat.avatarImage} alt="" className="w-full h-full object-cover"/></div>
          <div className="ml-3"><h2 className="font-semibold">{selectedChat.name}</h2><p className="text-xs text-gray-500">{selectedChat.lastSeen}</p></div>
        </div>
      </div>

      {/* Messages – no scroll/shake */}
      <div ref={chatContainerRef} className="flex-1 px-4 bg-white" style={{overflowY:'auto',overflowX:'hidden',overscrollBehavior:'none',scrollbarWidth:'none','::-webkit-scrollbar':{display:'none'}}}>
        <div className="sticky top-0 z-10 flex justify-center py-1" style={{opacity:showFloatingDate?1:0}}><div className="bg-black/70 backdrop-blur px-3 py-1 rounded-full text-white text-sm">Today</div></div>
        <div className="flex flex-col justify-end min-h-full">
          <div ref={dateBadgeRef} className="flex justify-center my-4"><div className="bg-black/60 backdrop-blur px-3 py-0.5 rounded-full text-white text-sm">Today</div></div>
          <div className="space-y-3 pb-4">
            {messages.map(m => <MessageBubble key={m.id} message={m} setReplyingTo={setReplyingTo} inputRef={inputRef}/>)}
            <div ref={messagesEndRef}/>
          </div>
        </div>
      </div>

      {/* Reply bar, input, emoji picker – unchanged (kept short for brevity) */}
      {/* ... same as previous working version ... */}
    </div>
  );
}

window.ChatView = ChatView;
window.MessageBubble = MessageBubble;
