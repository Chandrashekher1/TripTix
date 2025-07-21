import React, { useRef, useState, useEffect } from 'react';
import { IoClose, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { GoogleGenAI } from "@google/genai";
import { RiRobot2Line } from "react-icons/ri";
import { FiUser } from "react-icons/fi";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([
    { type: 'bot', text: "Hello! I'm TripTix Assistant. How can I help you today?" }
  ]);

  const query = useRef();
  const chatContainerRef = useRef();

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GPT_API_KEY });

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [message, loading]);

  const handleAsk = async () => {
    const inputText = query.current.value.trim();
    if (!inputText) {
      alert('Please enter a question.');
      return;
    }

    setMessage(prev => [...prev, { type: 'user', text: inputText }]);
    query.current.value = '';
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an AI bot that answers based on this FAQ:

          Q: How to book a bus?
          A: Select a route, choose a bus, pick seats, and proceed to payment.

          Q: How can I cancel a ticket?
          A: Go to 'Profile' > My Bookings' > select the ticket > click cancel.

          Q: Is there a refund policy?
          A: Yes, cancellations before 24 hours get 100% refund.

          Q: How can I contact support?
          A: Email us at help@triptix.com or call 1800-000-000.

          Only respond using this information.

          Question: ${inputText}`
      });

      setMessage(prev => [...prev, { type: 'bot', text: response.text }]);
    } catch (err) {
      console.error("Error:", err.message);
      setMessage(prev => [...prev, { type: 'bot', text: "Sorry, something went wrong." }]);
    }

    setLoading(false);
  };

  const handleSuggestedClick = (text) => {
    query.current.value = text;
    handleAsk();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-[340px] h-[460px]  rounded-2xl shadow-2xl flex flex-col border border-gray-900">
          <div className="btn-primary text-white p-4 flex justify-between items-center rounded-t-2xl">
            <h3 className="font-bold text-lg">TripTix Assistant</h3>
            <IoClose className="cursor-pointer text-2xl" onClick={() => setIsOpen(false)} />
          </div>

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-3 text-sm text-gray-700 bg-[#060e23]">
            {message.map((msg, index) => (
              <div key={index} className={`flex mb-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl px-4 py-2 text-sm max-w-[80%] shadow-md flex items-start gap-2 ${
                  msg.type === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-900 text-gray-300 rounded-bl-none'
                }`}>
                  {msg.type === 'user' ? <FiUser className="mt-0.5" /> : <RiRobot2Line className="text-xl mt-0.5 text-blue-600" />}
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start text-gray-500 text-xs italic mt-1">
                <span>Typing...</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap p-2 gap-2 border-t border-t-gray-700 bg-[#060e23]">
            {["How to book bus?", "How to cancel ticket?", "Refund Policies", "Contact support"].map((text, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedClick(text)}
                className="px-3 py-1 text-sm bg-gray-900 text-blue-700 rounded-full hover:bg-gray-700 cursor-pointer transition"
              >
                {text}
              </button>
            ))}
          </div>

          <div className="p-2 border-t bg-gray-800 flex gap-2">
            <input
              ref={query}
              type="text"
              placeholder="Type your question..."
              className="w-full p-2 border text-gray-300 rounded-md text-sm "
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button
              onClick={handleAsk}
              className="btn-primary text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition cursor-pointer"
            >
              Ask
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <IoChatbubbleEllipsesOutline className="text-2xl" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
