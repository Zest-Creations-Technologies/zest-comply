import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { copilotApi } from "@/lib/api";

export function useCopilotConversations() {
  const query = useQuery({
    queryKey: ["copilot-conversations"],
    queryFn: () => copilotApi.listConversations(),
  });

  return {
    conversations: query.data?.conversations ?? [],
    isLoading: query.isLoading,
  };
}

export function useCreateCopilotConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => copilotApi.createConversation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copilot-conversations"] });
    },
  });
}

export function useCopilotMessages(conversationId: string | null) {
  const query = useQuery({
    queryKey: ["copilot-messages", conversationId],
    queryFn: () => copilotApi.getMessages(conversationId!),
    enabled: Boolean(conversationId),
  });

  return {
    messages: query.data?.messages ?? [],
    isLoading: query.isLoading,
  };
}

export function useSendCopilotMessage(conversationId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => copilotApi.sendMessage(conversationId!, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copilot-messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["copilot-conversations"] });
    },
  });
}
