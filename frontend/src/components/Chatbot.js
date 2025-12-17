import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleChatToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/ask/', {  // Django API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Send data as JSON
        },
        body: JSON.stringify({ prompt }),  // Send the prompt as JSON
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setResponse('Something went wrong.');
    }
  };

  return (
    <>
      {/* Floating Icon Button */}
      <button
        onClick={handleChatToggle}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
      >
        💬
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
          <div className="h-64 overflow-y-auto mb-4">
            {response ? (
              <div className="text-gray-700 text-sm">{response}</div>
            ) : (
              <div className="text-gray-400 text-sm">Ask me something!</div>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-all"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
