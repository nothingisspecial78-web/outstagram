import React, { useState } from 'react';
import { Send, ChevronDown } from 'lucide-react';

export interface ChatThread {
  id: string;
  name: string;
  username: string;
  avatar: string;
  unread: boolean;
  messages: { id: string; text: string; sender: 'me' | 'them'; time: string }[];
}

interface DirectMessagesDrawerProps {
  threads: ChatThread[];
}

export const DirectMessagesDrawer: React.FC<DirectMessagesDrawerProps> = ({ threads }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [chatThreads, setChatThreads] = useState(threads);

  const activeThread = chatThreads.find((t) => t.id === selectedThreadId);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedThreadId) return;

    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === selectedThreadId) {
          return {
            ...thread,
            messages: [
              ...thread.messages,
              {
                id: crypto.randomUUID(),
                text: inputText,
                sender: 'me',
                time: 'Just now',
              },
            ],
          };
        }
        return thread;
      })
    );
    setInputText('');
  };

  return (
    <div className="fixed bottom-0 right-4 sm:right-12 z-50 select-none">
      {/* Floating Pill when minimized (Matching screenshot bottom right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 text-slate-800"
        >
          <div className="relative flex items-center justify-center">
            <Send className="size-4.5 text-slate-800" />
            <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-extrabold ring-2 ring-white">
              2
            </span>
          </div>

          <span className="text-xs font-black tracking-tight text-slate-900">Messages</span>

          {/* Overlapping mini avatars */}
          <div className="flex -space-x-2 ml-1">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User"
              className="size-5 rounded-full ring-2 ring-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="User"
              className="size-5 rounded-full ring-2 ring-white object-cover"
            />
          </div>
        </button>
      )}

      {/* Expanded Direct Messages Drawer */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[460px] bg-white rounded-t-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            {selectedThreadId ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedThreadId(null)}
                  className="text-xs font-bold text-[#FF6B00] hover:underline"
                >
                  ← Back
                </button>
                <div className="flex items-center gap-2">
                  <img
                    src={activeThread?.avatar}
                    alt={activeThread?.name}
                    className="size-6 rounded-full object-cover"
                  />
                  <span className="font-extrabold text-xs text-slate-900">{activeThread?.name}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">Direct Messages</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black">
                  2 new
                </span>
              </div>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <ChevronDown className="size-5" />
            </button>
          </div>

          {/* Body: Thread List OR Active Chat */}
          {!selectedThreadId ? (
            <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-100">
              {chatThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className="flex items-center gap-3 p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={thread.avatar}
                      alt={thread.name}
                      className="size-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    {thread.unread && (
                      <span className="absolute bottom-0 right-0 size-3 rounded-full bg-[#FF6B00] ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs truncate ${thread.unread ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                        {thread.name}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {thread.messages[thread.messages.length - 1]?.time}
                      </span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${thread.unread ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                      {thread.messages[thread.messages.length - 1]?.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/30">
              {/* Messages scroll */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 no-scrollbar">
                {activeThread?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs font-medium leading-relaxed ${
                        msg.sender === 'me'
                          ? 'bg-[#FF6B00] text-white rounded-br-xs shadow-sm'
                          : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Message..."
                  className="flex-1 h-9 px-3.5 rounded-full bg-slate-100 border-none text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className={`size-8 rounded-full flex items-center justify-center transition-all ${
                    inputText.trim()
                      ? 'bg-[#FF6B00] text-white shadow-sm hover:bg-orange-600'
                      : 'text-slate-300'
                  }`}
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
