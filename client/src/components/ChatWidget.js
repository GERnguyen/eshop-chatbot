// Import React and its hooks for component state and lifecycle management
import React, { useState, useEffect, useRef } from "react";
// Import useNavigate for programmatic navigation
import { useNavigate } from "react-router-dom";
// Import Font Awesome icons for the chat interface
import {
  FaRobot,
  FaPaperPlane,
  FaCommentDots,
  FaMinus,
  FaTrash,
  FaCouch,
  FaBed,
  FaChair,
  FaFire,
  FaQuestionCircle,
} from "react-icons/fa";
// Import ReactMarkdown for rendering markdown in chat messages
import ReactMarkdown from "react-markdown";

// Quick reply suggestions
const QUICK_REPLIES = [
  { icon: FaCouch, text: "Show me sofas", label: "Sofas" },
  { icon: FaBed, text: "Find a bed", label: "Beds" },
  { icon: FaChair, text: "Browse chairs", label: "Chairs" },
  { icon: FaFire, text: "What's on sale?", label: "Sales" },
  { icon: FaQuestionCircle, text: "How can you help me?", label: "Help" },
];

// Main chat widget component
const ChatWidget = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State to track if chat window is open or closed - restore from localStorage
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("chatWidgetOpen");
    return saved === "true";
  });
  // State to store all chat messages - restore from localStorage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  // State to track current input field value
  const [inputValue, setInputValue] = useState("");
  // State to store conversation thread ID - restore from localStorage
  const [threadId, setThreadId] = useState(() => {
    return localStorage.getItem("chatThreadId") || null;
  });
  // State for typing indicator
  const [isTyping, setIsTyping] = useState(false);
  // Ref to reference the bottom of messages container for auto-scrolling
  const messagesEndRef = useRef(null);

  // Effect hook: Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Effect hook: Save isOpen state to localStorage
  useEffect(() => {
    localStorage.setItem("chatWidgetOpen", isOpen.toString());
  }, [isOpen]);

  // Effect hook: Save threadId to localStorage
  useEffect(() => {
    if (threadId) {
      localStorage.setItem("chatThreadId", threadId);
    }
  }, [threadId]);

  // Effect hook: Show initial greeting when chat is first opened
  useEffect(() => {
    // Only run if chat is open AND no messages exist yet
    if (isOpen && messages.length === 0) {
      // Create initial greeting message
      const initialMessages = [
        {
          text: "Hello! I'm your shopping assistant. How can I help you today?", // Greeting text
          isAgent: true, // Flag to indicate this is from the AI agent
        },
      ];
      // Add greeting to messages state
      setMessages(initialMessages);
    }
  }, [isOpen, messages.length]); // Dependencies: re-run when isOpen or message count changes

  // Effect hook: Auto-scroll to bottom when new messages are added
  useEffect(() => {
    // Scroll the messages container to bottom smoothly
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Dependency: re-run whenever messages array changes

  // Function to toggle chat window open/closed (hide only)
  const hideChat = () => {
    setIsOpen(false);
  };

  // Function to close chat and clear all messages
  const closeAndClearChat = () => {
    setIsOpen(false);
    setMessages([]);
    setThreadId(null);
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatThreadId");
  };

  // Function to open chat
  const openChat = () => {
    setIsOpen(true);
  };

  // Ref to reference the textarea for auto-resize
  const textareaRef = useRef(null);

  // Function to handle changes in the input field
  const handleInputChange = (e) => {
    // Update inputValue state with current text field value
    setInputValue(e.target.value);
    // Auto-resize textarea
    autoResizeTextarea();
  };

  // Function to auto-resize textarea based on content
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get correct scrollHeight
      textarea.style.height = "auto";
      // Set height to scrollHeight (content height), max 120px
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  // Log messages to console for debugging purposes
  console.log(messages);

  // Function to handle action commands from bot response (e.g., add to cart)
  const handleActionCommand = (responseText) => {
    // Check for ADD_TO_CART action
    const cartMatch = responseText.match(/\[\[ACTION:ADD_TO_CART:([^\]]+)\]\]/);
    if (cartMatch) {
      const itemId = cartMatch[1];
      addItemToCart(itemId);
    }
    // Check for ADD_TO_WISHLIST action
    const wishlistMatch = responseText.match(/\[\[ACTION:ADD_TO_WISHLIST:([^\]]+)\]\]/);
    if (wishlistMatch) {
      const itemId = wishlistMatch[1];
      addItemToWishlist(itemId);
    }
    // Remove action commands from displayed text
    return responseText.replace(/\[\[ACTION:[^\]]+\]\]/g, "").trim();
  };

  // Function to add item to cart by item_id
  const addItemToCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8000/products/${itemId}`);
      if (response.ok) {
        const product = await response.json();
        const existingCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const existingItem = existingCart.find(item => item.item_id === product.item_id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          existingCart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem("cartItems", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Function to add item to wishlist by item_id
  const addItemToWishlist = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8000/products/${itemId}`);
      if (response.ok) {
        const product = await response.json();
        const existingFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (!existingFavorites.some(item => item.item_id === product.item_id)) {
          existingFavorites.push(product);
          localStorage.setItem("favorites", JSON.stringify(existingFavorites));
          window.dispatchEvent(new Event("favoritesUpdated"));
        }
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // Function to send user message and get AI response
  const handleSendMessage = async (e, quickReplyText = null) => {
    // Prevent default form submission behavior (page refresh)
    if (e) e.preventDefault();
    
    const messageText = quickReplyText || inputValue;
    if (!messageText.trim()) return;
    
    // Log user input for debugging
    console.log(messageText);

    // Create message object for user's input
    const message = {
      text: messageText, // User's typed message
      isAgent: false, // Flag indicating this is from user, not AI
    };

    // Add user message to messages array using spread operator
    setMessages((prevMessages) => [...prevMessages, message]);
    // Clear input field immediately after sending
    setInputValue("");
    // Show typing indicator
    setIsTyping(true);

    // Determine API endpoint: use existing thread if available, otherwise create new
    const endpoint = threadId
      ? `http://localhost:8000/chat/${threadId}`
      : "http://localhost:8000/chat";

    try {
      // Make HTTP POST request to backend API
      const response = await fetch(endpoint, {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // Tell server we're sending JSON
        },
        body: JSON.stringify({
          message: messageText, // Send user's message in request body
        }),
      });

      // Check if response status indicates success (200-299 range)
      if (!response.ok) {
        // Throw error if response status indicates failure
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse JSON response from server
      const data = await response.json();
      // Log successful response for debugging
      console.log("Success:", data);

      // Process action commands and clean response text
      const cleanedResponse = handleActionCommand(data.response);

      // Create message object for AI agent's response
      const agentResponse = {
        text: cleanedResponse, // AI's response text (cleaned)
        isAgent: true, // Flag indicating this is from AI agent
        threadId: data.threadId, // Thread ID for conversation continuity
      };

      // Add AI response to messages array
      setMessages((prevMessages) => [...prevMessages, agentResponse]);
      // Update thread ID for future messages in this conversation
      setThreadId(data.threadId);
      // Log updated messages for debugging
      console.log(messages);
    } catch (error) {
      // Log any errors that occur during API call
      console.error("Error:", error);
      // Add error message
      setMessages((prevMessages) => [...prevMessages, {
        text: "Sorry, I'm having trouble connecting. Please try again.",
        isAgent: true,
      }]);
    } finally {
      // Hide typing indicator
      setIsTyping(false);
    }
  };

  // Handle quick reply click
  const handleQuickReply = (text) => {
    handleSendMessage(null, text);
  };

  // Render the chat widget UI
  return (
    // Main container with conditional CSS class based on open/closed state
    <div className={`chat-widget-container ${isOpen ? "open" : ""}`}>
      {/* Conditional rendering: show chat interface if open, otherwise show chat button */}
      {isOpen ? (
        <>
          {/* Chat header with title and close button */}
          <div className="chat-header">
            <div className="chat-title">
              {/* Robot icon */}
              <FaRobot />
              {/* Chat title text */}
              <h3>Shop Assistant</h3>
            </div>
            {/* Header buttons: hide and close+clear */}
            <div className="chat-header-buttons">
              <button
                className="hide-button"
                onClick={hideChat}
                title="Hide chat"
              >
                <FaMinus />
              </button>
              <button
                className="close-button"
                onClick={closeAndClearChat}
                title="Close and clear chat"
              >
                <FaTrash />
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div className="chat-messages">
            {/* Quick replies - show only when no messages or after greeting */}
            {messages.length <= 1 && (
              <div className="quick-replies">
                <p className="quick-replies-label">Quick suggestions:</p>
                <div className="quick-replies-buttons">
                  {QUICK_REPLIES.map((reply, index) => (
                    <button
                      key={index}
                      className="quick-reply-btn"
                      onClick={() => handleQuickReply(reply.text)}
                    >
                      <reply.icon size={14} />
                      <span>{reply.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Map through messages array to render each message */}
            {messages.map((message, index) => (
              // Container for each message (key prop required for React lists)
              <div key={index}>
                {/* Message bubble with conditional CSS class for styling */}
                <div
                  className={`message ${
                    message.isAgent ? "message-bot" : "message-user"
                  }`}
                >
                  {/* Display message - render markdown for bot messages */}
                  {message.isAgent ? (
                    <div className="markdown-content">
                      <ReactMarkdown
                        components={{
                          // Custom link renderer to use React Router navigation
                          a: ({ href, children }) => {
                            // Check if it's an internal link (starts with /)
                            if (href && href.startsWith("/")) {
                              return (
                                <a
                                  href={href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigate(href);
                                  }}
                                  style={{
                                    color: "#4a00e0",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }}
                                >
                                  {children}
                                </a>
                              );
                            }
                            // External links open in new tab
                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {children}
                              </a>
                            );
                          },
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="message message-bot typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {/* Invisible div at bottom for auto-scroll reference */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form for sending messages */}
          <form className="chat-input-container" onSubmit={handleSendMessage}>
            {/* Textarea input field with auto-expand */}
            <textarea
              ref={textareaRef} // Ref for auto-resize
              className="message-input" // CSS class for styling
              placeholder="Type your message..." // Placeholder text
              value={inputValue} // Controlled input value
              onChange={handleInputChange} // Handle input changes
              onKeyDown={(e) => {
                // Submit on Enter (without Shift)
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim() !== "") {
                    handleSendMessage(e);
                    // Reset textarea height after sending
                    if (textareaRef.current) {
                      textareaRef.current.style.height = "auto";
                    }
                  }
                }
              }}
              rows={1} // Start with 1 row
            />
            {/* Send button */}
            <button
              type="submit" // Submit form when clicked
              className="send-button" // CSS class for styling
              disabled={inputValue.trim() === ""} // Disable if input is empty or whitespace
            >
              {/* Paper plane icon for send button */}
              <FaPaperPlane size={16} />
            </button>
          </form>
        </>
      ) : (
        /* Chat toggle button (shown when chat is closed) */
        <button className="chat-button" onClick={openChat}>
          {/* Comment/chat icon */}
          <FaCommentDots />
        </button>
      )}
    </div>
  );
};

// Export component as default export
export default ChatWidget;
