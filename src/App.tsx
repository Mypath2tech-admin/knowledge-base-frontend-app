import { useEffect, useRef, useState } from "react";
import "./App.css";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // n8n webhook configuration
  const webhookUrl =
    "https://mypath2tech.app.n8n.cloud/webhook/6ac574cc-5aa8-4993-916b-6682d4f37bbc/chat";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem("n8n-chat-session-id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
      // Load previous session if exists
      loadPreviousSession(storedSessionId);
    } else {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem("n8n-chat-session-id", newSessionId);
    }
  }, []);

  const generateSessionId = (): string => {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  };

  const loadPreviousSession = async (sessionId: string) => {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "loadPreviousSession",
          sessionId: sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          // Convert loaded messages to our format
          const loadedMessages = data.messages.map(
            (msg: any, index: number) => ({
              id: Date.now() + index,
              text: msg.text || msg.content || "",
              isUser: msg.role === "user" || msg.sender === "user",
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            })
          );
          setMessages((prev) => [...prev, ...loadedMessages]);
        }
      }
    } catch (error) {
      console.error("Failed to load previous session:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Prepare the payload for n8n webhook
      const payload: any = {
        action: "sendMessage",
        chatInput: messageText,
        sessionId: sessionId,
        message: messageText,
        timestamp: new Date().toISOString(),
      };

      console.log("Sending payload to n8n:", payload);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "User-Agent": "n8n-chat-frontend/1.0.0",
          Connection: "keep-alive",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("n8n response data:", data);

      // Handle the response from n8n
      let responseText = "Sorry, I could not process your request.";

      if (data.response) {
        responseText = data.response;
      } else if (data.output) {
        responseText = data.output;
      } else if (data.text) {
        responseText = data.text;
      } else if (data.message) {
        responseText = data.message;
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Detailed error sending message:", error);

      let errorText = "Sorry, something went wrong. Please try again.";

      if (error instanceof Error) {
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);

        if (error.name === "TypeError" && error.message.includes("CORS")) {
          errorText =
            "CORS error: Please configure CORS in your n8n Chat Trigger node.";
        } else if (
          error.name === "TypeError" &&
          error.message.includes("Failed to fetch")
        ) {
          errorText =
            "Network error: Unable to connect to n8n. Check if your workflow is active.";
        } else if (error.message.includes("404")) {
          errorText = "Webhook not found: Please check your n8n webhook URL.";
        } else if (error.message.includes("500")) {
          errorText = "Server error: There's an issue with your n8n workflow.";
        }
      }

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>My Virtual Assistant</h1>
        <p>Your knowledge assistant</p>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.isUser ? "user-message" : "bot-message"
            }`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot-message">
            <div className="message-content loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="chat-input"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 11L12 6L17 11M12 18V7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(90 12 12)"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
