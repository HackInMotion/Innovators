import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

const BotpressChat = () => {
  const [message, setMessage] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
    script.async = true;
    script.onload = () => {
      if (window.botpress) {
        window.botpress.init({
          "botId": "84dc213a-96dd-4692-805b-b9e1257aa5fe",
          "configuration": {
            "botName": "Innovators",
            "botAvatar": "https://files.bpcontent.cloud/2025/04/04/14/20250404145631-1DD7UUX1.avif",
            "botDescription": " Innovators – AI Education Chatbot",
            "website": {},
            "email": {},
            "phone": {},
            "termsOfService": {},
            "privacyPolicy": {},
            "color": "#181676",
            "variant": "solid",
            "themeMode": "light",
            "fontFamily": "inter",
            "radius": 1,
            "allowFileUpload": true
          },
          "clientId": "6f5b19bd-b4bf-4900-9ac9-2348a5af3571",
          "selector": "#webchat"
        });
        

        window.botpress.on("webchat:ready", () => {
          window.botpress.open();
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      window.botpress.sendEvent({
        type: "text",
        text: message,
      });
      setMessage("");
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed bottom-4 right-4 w-96 max-w-sm rounded-lg">
      <div
        id="webchat"
        ref={chatRef}
        className="w-full h-96 rounded-lg overflow-hidden"
      ></div>
    </div>,
    document.body
  );
};
export default BotpressChat;