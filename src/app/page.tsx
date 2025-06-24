import { ChatPanel } from "@/widgets/ChatPanel/ui/ChatPanel";

export default function Home() {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatPanel />
    </div>
  );
}
