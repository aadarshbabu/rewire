import { ChatInterface } from "@/components/mental-health/chat-interface";

interface ChatDetailPageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatDetailPage({ params }: ChatDetailPageProps) {
  const { chatId } = await params;

  return (
    <div className="h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-teal-500 selection:text-white">
      <ChatInterface initialChatId={chatId} />
    </div>
  );
}
