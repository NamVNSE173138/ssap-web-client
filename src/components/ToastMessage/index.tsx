import React, { useState } from "react";
import * as Toast from "@radix-ui/react-toast";

type MessageType = "success" | "error" | "info";

interface MessageProps {
  title: string;
  description: string;
  type: MessageType;
  duration?: number; // Duration in milliseconds (default: 5000)
}

export const ToastMessage: React.FC<MessageProps> = ({
  title,
  description,
  type,
  duration = 5000,
}) => {
  const [open, setOpen] = useState(false);

  const typeStyles = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  const show = () => setOpen(true);

  return (
    <>
      <button
        onClick={show}
        className={`px-4 py-2 rounded text-white ${typeStyles[type]} shadow-md`}
      >
        Show {type.charAt(0).toUpperCase() + type.slice(1)} Message
      </button>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className={`rounded shadow-lg p-4 text-white ${typeStyles[type]}`}
          open={open}
          onOpenChange={setOpen}
          duration={duration}
        >
          <Toast.Title className="font-bold">{title}</Toast.Title>
          <Toast.Description>{description}</Toast.Description>
          <Toast.Action altText="Close" asChild>
            <button className="text-sm underline ml-4">Close</button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4" />
      </Toast.Provider>
    </>
  );
};
