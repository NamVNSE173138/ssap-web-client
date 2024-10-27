import { getAllAccounts } from "@/services/ApiServices/accountService";
import { getAllMessages, getChatHistory, sendMessage } from "@/services/ApiServices/chatService";
import { RootState } from "@/store/store";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
//import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "@/constants/api";
import { log } from "console";
import { getMessaging, onMessage } from "firebase/messaging";

interface Account {
  id: number;
  username: string;
  avatarUrl?: string;
  unreadCount: number;
}

interface Message {
  senderId: number;
  receiverId: number;
  message: string;
  timestamp: Date;
  isRead?: boolean;
}

const Chat: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedUser, setSelectedUser] = useState<Account | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const user = useSelector((state: RootState) => state.token.user);
  //const token = useSelector((state: RootState) => state.token.token);
  const messaging = getMessaging();
  //const connectionRef = useRef<signalR.HubConnection | null>(null); 

  const fetchAccounts = async () => {
    if (user == null) {
      return;
    }
    const response = await getAllAccounts();
    const accountsWithCount = response.map((account: Account) => ({ ...account, unreadCount: 0 }));

    const allMessagesResponse = await getAllMessages(parseInt(user.id));
    const allMessages = allMessagesResponse.data;

    const updatedAccounts = accountsWithCount.map((account: any) => {
      const unreadMessages = allMessages.filter((message: any) =>
        message.senderId === account.id && !message.isRead
      ).length;

      return {
        ...account,
        unreadCount: unreadMessages
      };
    });

    setAccounts(updatedAccounts);
  };
  useEffect(() => {
    
    fetchAccounts();
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      const fetchChatHistory = async () => {
        if (user == null) {
          return;
        }
        const history = await getChatHistory(parseInt(user.id), selectedUser.id);

        const messagesWithDate = history.data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.sentDate),
        }));

        messagesWithDate.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        setChatHistory(messagesWithDate);

        const updatedAccounts = accounts.map(account => {
          if (account.id === selectedUser.id) {
            return {
              ...account,
              unreadCount: 0
            };
          }
          const unreadMessages = messagesWithDate.filter((msg: any) => msg.receiverId === account.id && !msg.isRead).length;
          return {
            ...account,
            unreadCount: unreadMessages
          };
        });
        setAccounts(updatedAccounts);
      };

      fetchChatHistory();
      navigator.serviceWorker.addEventListener('message', (event) => {
            if(!event.data.notification && event.data.messageType != "push-received"){
              //console.log(event.data);
              fetchChatHistory();
            }
      });

        onMessage(messaging, (payload: any) => {
            //console.log('Message received:', payload);
            if (!payload.notification && payload.data.messageType !== "push-received") {
                fetchChatHistory();
            }
        });
      
    }
    
  }, [selectedUser]);

  /*useEffect(() => {
    const connectSignalR = async () => {
      if (user == null || token == null) return;
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE_URL}/chat?userId=${user.id}`, {
          transport: signalR.HttpTransportType.WebSockets,
          withCredentials: true,
        })
        .build();

      connection.on("ReceiveMessage", (senderId: number, message: string) => {
          //console.log("AAAA");
          fetchAccounts();
        if (selectedUser && selectedUser.id === senderId) {
          setChatHistory((prevMessages) => [
            ...prevMessages,
            { senderId, receiverId: parseInt(user.id), message, timestamp: new Date() }
          ]);
        }
      });

      try {
        await connection.start();
        console.log("SignalR connected");
        connectionRef.current = connection;
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    connectSignalR();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
      
  }, [user, selectedUser]);*/

  const handleSendMessage = async () => {
    if (selectedUser && message) {
      if (user == null) {
        return;
      }
      const currentTimestamp = new Date().toISOString();
      await sendMessage(parseInt(user.id), selectedUser.id, message);

      setChatHistory([
        ...chatHistory,
        { senderId: parseInt(user.id), receiverId: selectedUser.id, message, timestamp: new Date(currentTimestamp) }
      ]);

      /*if (connectionRef.current) {
        await connectionRef.current.invoke("SendMessageToUser", parseInt(user.id), selectedUser.id, message);
      }*/

      setMessage("");
    }
  };

  if (user == null) {
    return <></>;
  }

  return (
    <div style={{ display: "flex", height: "100vh", padding: "30px" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "20px", overflowY: "scroll" }}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {accounts.map((account) => (
            <li
              key={account.id}
              onClick={() => setSelectedUser(account)}
              style={{
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                backgroundColor: selectedUser?.id === account.id ? "#ddd" : "#f9f9f9",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <img
                src={account.avatarUrl || "https://via.placeholder.com/40"}
                alt={account.username}
                style={{width:"40px", height:"40px", borderRadius: "50%", marginRight: "20px" }}
              />
              <span>{account.username}</span>
              {account.unreadCount > 0 && (
                <span
                  style={{
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                    marginLeft: "10px"
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ width: "70%", display: "flex", flexDirection: "column", padding: "20px" }}>
        <div style={{ flex: 1, overflowY: "scroll", paddingBottom: "20px" }}>
          {selectedUser ? (
            <>
              <h2 className="font-extrabold">Chat with {selectedUser.username}</h2>
              <div>
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: msg.senderId === parseInt(user?.id) ? "flex-end" : "flex-start"
                    }}
                  >
                    <div
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor: msg.senderId === parseInt(user?.id) ? "#DCF8C6" : "#f1f1f1",
                        maxWidth: "60%"
                      }}
                    >
                      {msg.message}
                      <div style={{ fontSize: "12px", textAlign: "right", marginTop: "5px" }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <h2>Select a user to chat</h2>
          )}
        </div>

        {selectedUser && (
          <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                marginRight: "10px"
              }}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0084ff",
                color: "white",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
