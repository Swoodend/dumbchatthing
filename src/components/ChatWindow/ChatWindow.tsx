import './styles.css';

const ChatWindow = () => {
  return (
    <div className="chat-window">
      <div className="chat-readout-container">
        <div className="chat-readout"></div>
      </div>
      <div className="chat-action-row">
        <textarea className="block chat-input" />
        <div className="chat-send-button-container">
          <button className="chat-send-button" value="Send">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
