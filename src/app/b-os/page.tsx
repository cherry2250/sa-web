import { ChatPanel } from "@/widgets/ChatPanel";
import { getApiKey } from "@/shared/config/apiKeys";

export default function BOSPage() {
  return <ChatPanel apiKey={getApiKey("B_OS")} />;
}
