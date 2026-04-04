import { User, Bot, Loader2 } from "lucide-react";
import SQLBlock from "./SQLBlock";
import ResultTable from "./ResultTable";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sql?: string;
  data?: Record<string, unknown>[];
  loading?: boolean;
  error?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-4 px-4 py-6 ${isUser ? "bg-transparent" : "bg-chat-ai"}`}>
      <div className="mx-auto flex w-full max-w-3xl gap-4">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            isUser ? "bg-chat-user text-foreground" : "bg-primary/15 text-primary"
          }`}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        <div className="min-w-0 flex-1">
          {message.loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Querying employee data...
            </div>
          ) : message.error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {message.content}
            </div>
          ) : isUser ? (
            <p className="text-sm leading-relaxed text-foreground">{message.content}</p>
          ) : (
            <div>
              <p className="text-sm leading-relaxed text-foreground">{message.content}</p>
              {message.sql && <SQLBlock sql={message.sql} />}
              {message.data && <ResultTable data={message.data} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
