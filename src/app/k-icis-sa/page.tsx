import { ChatPanel } from "@/widgets/ChatPanel";
import { getApiKey } from "@/shared/config/apiKeys";

export default function KICISPage() {
  return <ChatPanel apiKey={getApiKey("K_ICIS_SA")} />;
}
