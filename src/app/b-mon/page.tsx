import { ChatPanel } from "@/widgets/ChatPanel";
import { getApiKey } from "@/shared/config/apiKeys";

export default function BMONPage() {
  return <ChatPanel apiKey={getApiKey("B_MON")} />;
}
