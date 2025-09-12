import React, { useState, useRef, useEffect } from 'react';
import { sendMessage, getInitialInfo } from '../../services/chatbotApi';
import './Chatbot.scss';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const initialInfo = getInitialInfo();
            setMessages([
                {
                    type: 'bot',
                    content: initialInfo.welcomeMessage,
                    features: initialInfo.features
                }
            ]);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const response = await sendMessage(userMessage);
            setMessages(prev => [...prev, { type: 'bot', content: response.message }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                type: 'bot',
                content: "I'm sorry, I encountered an error. Please try again."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleFeatureClick = (feature) => {
        // Just show the feature description
        setMessages(prev => [...prev, {
            type: 'bot',
            content: feature.description
        }]);
    };

    return (
        <div className="chatbot-container">
            {/* Chatbot Button */}
            <button 
                className={`chatbot-button ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>RadiologyAI Assistant</h3>
                    </div>
                    
                    <div className="chatbot-messages" ref={chatContainerRef}>
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.type}`}>
                                <div className="message-content">
                                    {message.content}
                                    {message.features && (
                                        <div className="feature-buttons">
                                            {message.features.map(feature => (
                                                <button
                                                    key={feature.id}
                                                    onClick={() => handleFeatureClick(feature)}
                                                    className="feature-button"
                                                >
                                                    {feature.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
