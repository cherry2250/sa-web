import { ChatPanel } from "@/widgets/ChatPanel";
import { getApiKey } from "@/shared/config/apiKeys";

export default function CMPage() {
  return <ChatPanel apiKey={getApiKey("CM")} />;
}
