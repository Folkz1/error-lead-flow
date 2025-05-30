
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useChatHistoriesDetail } from "@/hooks/useChatHistoriesDetail";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatInterfaceProps {
  sessionId: string;
  interacao: any;
}

export const ChatInterface = ({ sessionId, interacao }: ChatInterfaceProps) => {
  const { data: chatHistory, isLoading, error } = useChatHistoriesDetail(sessionId);

  const renderMessage = (message: any, timestamp: string) => {
    // Parse the message structure from n8n_chat_histories
    const isBot = message.type === 'ai' || message.role === 'assistant';
    const messageText = message.message || message.content || message.text || JSON.stringify(message);
    
    return (
      <div key={timestamp} className={`flex gap-3 mb-4 ${isBot ? '' : 'flex-row-reverse'}`}>
        <Avatar className="h-8 w-8">
          {isBot ? (
            <>
              <AvatarFallback className="bg-blue-100">
                <Bot className="h-4 w-4 text-blue-600" />
              </AvatarFallback>
            </>
          ) : (
            <>
              <AvatarFallback className="bg-green-100">
                <User className="h-4 w-4 text-green-600" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
        
        <div className={`flex flex-col max-w-[70%] ${isBot ? '' : 'items-end'}`}>
          <div className={`p-3 rounded-lg ${
            isBot 
              ? 'bg-gray-100 text-gray-900' 
              : 'bg-blue-500 text-white'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{messageText}</p>
          </div>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {format(new Date(timestamp), 'HH:mm', { locale: ptBR })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Histórico da Conversa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-12 bg-gray-200 rounded-lg flex-1"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Histórico da Conversa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Erro ao carregar histórico: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Histórico da Conversa
          </div>
          <Badge variant="secondary">
            {chatHistory?.length || 0} mensagens
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 pr-4">
          {chatHistory && chatHistory.length > 0 ? (
            <div className="space-y-4">
              {chatHistory.map((chat) => 
                renderMessage(chat.message, chat.timestamp_criacao || '')
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conversa encontrada</h3>
              <p className="text-gray-600">
                O histórico de chat aparecerá aqui quando disponível.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
