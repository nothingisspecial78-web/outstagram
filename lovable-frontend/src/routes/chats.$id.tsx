import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "@/components/hb/dm/Inbox";
export const Route = createFileRoute("/chats/$id")({
  head: () => ({ meta: [
    { title: "Conversation — Outstagram" },
    { name: "description", content: "A paper-slow conversation with a friend." },
    { property: "og:title", content: "Conversation — Outstagram" },
    { property: "og:description", content: "You've said a lot. Say the rest in person." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }), component: Conversation,
});
function Conversation() { const { id } = Route.useParams(); return <Inbox chatId={id} />; }
