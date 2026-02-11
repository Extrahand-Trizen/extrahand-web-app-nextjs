import { redirect } from "next/navigation";

export default function ChatPage() {
  redirect("/coming-soon?type=info&label=Chat");
}

