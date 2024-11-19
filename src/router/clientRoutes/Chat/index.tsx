import { getAllAccounts } from "@/services/ApiServices/accountService";
import { getAllMessages, getChatHistory, sendMessage } from "@/services/ApiServices/chatService";
import { RootState } from "@/store/store";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getMessaging, onMessage } from "firebase/messaging";
import { useLocation, useNavigate } from "react-router-dom";
import { getRequestsByApplicantId } from "@/services/ApiServices/requestService";

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
  const messaging = getMessaging();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatEnabled, setIsChatEnabled] = useState<boolean>(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const chatUserId = queryParams.get("id");
    if (chatUserId) {
      const userToChat = accounts.find(account => account.id === parseInt(chatUserId));
      if (userToChat) setSelectedUser(userToChat);
    }
  }, [location.search, accounts]);

  const fetchAccounts = async () => {
    if (user == null) {
      return;
    }
    const role = user.role;
    const response = await getAllAccounts();
    const accountsWithCount = response.map((account: Account) => ({ ...account, unreadCount: 0 }));
    console.log(accountsWithCount)
    const filteredAccounts = accountsWithCount.filter((account: any) => {
      if (role === "Provider") {
        return account.roleName === "Applicant";
      } else if (role === "Applicant") {
        return account.roleName === "Provider";
      }
      return false;
    });

    const allMessagesResponse = await getAllMessages(parseInt(user.id));
    const allMessages = allMessagesResponse.data;

    const updatedAccounts = filteredAccounts.map((account: any) => {
      const unreadMessages = allMessages.filter((message: any) =>
        message.senderId === account.id && !message.isRead
      ).length;

      return {
        ...account,
        unreadCount: unreadMessages
      };
    });

    setAccounts(updatedAccounts);

    if (role === "Applicant") {
      const requestsResponse = await getRequestsByApplicantId(parseInt(user.id));
      const requestData = requestsResponse.data;
      const hasPendingRequest = requestData.some((request: any) => request.status === "Pending");
      setIsChatEnabled(hasPendingRequest);
    }else{
      setIsChatEnabled(true);
    }
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
        if (!event.data.notification && event.data.messageType != "push-received") {
          fetchChatHistory();
        }
      });

      onMessage(messaging, (payload: any) => {
        if (!payload.notification && payload.data.messageType !== "push-received") {
          fetchChatHistory();
        }
      });

    }

  }, [selectedUser]);


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

      setMessage("");
    }
  };

  const handleAccountClick = async (account: Account) => {
    const chatUserId = account.id;

    navigate(`/chat?id=${chatUserId}`);
    setSelectedUser(account);

    if (user?.role === "Applicant") {
      const requestsResponse = await getRequestsByApplicantId(parseInt(user.id));
      const requestData = requestsResponse.data;
      console.log(requestData)
      const hasPendingRequest = requestData.some((request: any) => request.status === "Pending" && request.service.providerId === account.id);
      setIsChatEnabled(hasPendingRequest);
    }
  };

  if (user == null) {
    return <></>;
  }

  return (
    <div className="bg-blue-100" style={{ display: "flex", height: "100vh", padding: "30px" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "20px", overflowY: "scroll" }}>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {accounts.map((account) => (
            <li
              key={account.id}
              onClick={() => handleAccountClick(account)}
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
                src={account.avatarUrl || "https://github.com/shadcn.png"}
                alt={account.username}
                style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "20px" }}
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
              placeholder={isChatEnabled ? "Type your message..." : "You have no more requests's status 'Pending' so you cannot chat with the Provider, thank you!."}
              disabled={!isChatEnabled}
              style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #ccc", marginRight: "10px" }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isChatEnabled}
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
