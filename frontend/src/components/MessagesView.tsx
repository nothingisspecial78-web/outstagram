import React, { useState } from 'react';
import { Send, Search, Phone, Video, Info, Image, Heart, Smile } from 'lucide-react';
import type { ChatThread } from './DirectMessagesDrawer';

interface MessagesViewProps {
  threads: ChatThread[];
}

export const MessagesView: React.FC<MessagesViewProps> = ({ threads }) => {
  const [chatThreads, setChatThreads] = useState(threads);
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id || 'c1');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  const activeThread = chatThreads.find((t) => t.id === selectedThreadId) || chatThreads[0];

  const handleSend = () => {
    if (!inputMessage.trim() || !activeThread) return;

    setChatThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: crypto.randomUUID(),
                  text: inputMessage,
                  sender: 'me',
                  time: 'Just now',
                },
              ],
            }
          : t
      )
    );
    setInputMessage('');
  };

  const filteredThreads = chatThreads.filter((t) =>
    `${t.name} ${t.username}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl h-[84vh] max-h-[760px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row my-2">
      {/* Left Column: Messages List */}
      <div className="w-full md:w-80 lg:w-88 border-r border-slate-200 flex flex-col h-full bg-white shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base text-slate-900">abdullanothing7</span>
          </div>
          <button className="p-1 text-slate-800 hover:text-slate-500">
            <Send className="size-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400">
            <Search className="size-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-50">
          {filteredThreads.map((thread) => {
            const isSelected = thread.id === activeThread?.id;
            const lastMsg = thread.messages[thread.messages.length - 1];
            return (
              <div
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-slate-100/80' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="size-12 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${thread.unread ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                      {thread.name}
                    </p>
                    <span className="text-[10px] text-slate-400">{lastMsg?.time}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${thread.unread ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                    {lastMsg?.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Conversation */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-white px-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeThread.avatar}
                alt={activeThread.name}
                className="size-10 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900 leading-tight">{activeThread.name}</p>
              <p className="text-[11px] text-emerald-600 font-semibold">Active now</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-800">
            <button className="p-2 rounded-full hover:bg-slate-100">
              <Phone className="size-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100">
              <Video className="size-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100">
              <Info className="size-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40 no-scrollbar">
          {/* Profile Card Banner */}
          <div className="text-center py-6 border-b border-slate-100 mb-4">
            <img
              src={activeThread.avatar}
              alt={activeThread.name}
              className="size-20 rounded-full object-cover mx-auto ring-4 ring-white shadow-md mb-2"
            />
            <p className="font-black text-base text-slate-900">{activeThread.name}</p>
            <p className="text-xs text-slate-400">@{activeThread.username} · Outstagram Explorer</p>
            <button className="mt-3 px-4 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200">
              View Profile
            </button>
          </div>

          {activeThread.messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
                  m.sender === 'me'
                    ? 'bg-gradient-to-r from-[#FF6B00] to-orange-500 text-white rounded-br-xs shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white">
          <button className="p-2 text-slate-500 hover:text-slate-800">
            <Smile className="size-5" />
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message..."
            className="flex-1 h-10 px-4 rounded-full bg-slate-100 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button className="p-2 text-slate-500 hover:text-slate-800">
            <Image className="size-5" />
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-800">
            <Heart className="size-5" />
          </button>
          {inputMessage.trim() && (
            <button
              onClick={handleSend}
              className="px-3 py-1.5 rounded-full bg-[#FF6B00] text-white text-xs font-bold shadow-sm"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
