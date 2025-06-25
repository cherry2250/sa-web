import { ChatPanel } from "@/widgets/ChatPanel";
import { getApiKey } from "@/shared/config/apiKeys";

export default function KOSSaPage() {
  return <ChatPanel apiKey={getApiKey("KOS_SA")} />;
}
