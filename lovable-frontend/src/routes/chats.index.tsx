import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "@/components/hb/dm/Inbox";
export const Route = createFileRoute("/chats/")({
  head: () => ({ meta: [
    { title: "Chats — Outstagram" },
    { name: "description", content: "Conversations with a 20-message wall. Say the rest in person." },
    { property: "og:title", content: "Chats — Outstagram" },
    { property: "og:description", content: "Every chat ends in a meetup." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }), component: Chats,
});
function Chats() { return <Inbox />; }
