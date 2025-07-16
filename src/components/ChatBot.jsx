import React, { useRef, useState } from 'react';
import { IoClose, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { GoogleGenAI } from "@google/genai"
import { RiRobot2Line } from "react-icons/ri";
import { FiUser } from "react-icons/fi";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [message,setMessage] = useState([
    {type: 'bot',text: "Helllo! I'm TripTix assistant. How can I help you today?"}
  ])
  const query = useRef()
  const chatContainerRef = useRef()

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GPT_API_KEY });

  const handleAsk = async () => {
    const inputText = query.current.value;
    if (!inputText.trim()) {
      alert('Please enter a question.')

      return;
    }
    setMessage(prev => [...prev, {type: 'user', text:inputText}])
    query.current.value = ''
    setLoading(true);
    try {
      const response = await ai.models.generateContent({ 
        model: "gemini-2.5-flash", 
        contents: `You are an AI bot that answers based on this FAQ:

            Q: How to book a bus?
            A: Select a route, choose a bus, pick seats, and proceed to payment.

            Q: How can I cancel a ticket?
            A: Go to 'My Bookings' > select the ticket > click cancel.

            Q: Is there a refund policy?
            A: Yes, cancellations before 24 hours get 100% refund.

            Q: How can I contact support?
            A: Email us at help@swiftride.com or call 1800-000-000.

            Only respond using this information.

            Question: ${inputText}`
    })

      setMessage(prev => [...prev, {type:'bot', text:response.text }]);
    } catch (err) {
      console.error("Error:", err.message);
      setMessage(prev => [...prev, { type: 'bot', text: "Sorry, something went wrong." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-[300px] h-[400px] bg-white rounded-xl shadow-xl flex flex-col">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex justify-between items-center rounded-t-xl">
            <h3 className="font-bold text-lg">Ask TripTixBot</h3>
            <IoClose className="cursor-pointer text-2xl" onClick={() => setIsOpen(false)} />
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2 text-sm text-gray-700" ref={chatContainerRef}>
            {message.map((msg,index) => (
                <div className={`flex ${msg.type === 'user'? 'justify-start':'justify-end'}`} key={index}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow my-2 ${
                        msg.type === 'user' ? 'bg-blue-500 text-white rounded-bl-none':
                        'bg-gray-100 text-gray-800 rounded-br-none'
                    }`}>
                        <div className="flex items-center gap-2 my-2">
                            {msg.type === 'user' ? <FiUser /> : <RiRobot2Line style={{fontSize:'20px'}}/>}
                            <span>{msg.text}</span>
                        </div>
                    </div>
                </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="text-sm text-gray-500 italic">Typing...</div>
              </div>
            )}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              ref={query}
              type="text"
              placeholder="Type your question..."
              className="w-full p-2 border rounded-md text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button onClick={handleAsk} className="btn-primary px-4 text-sm">Ask</button>
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
