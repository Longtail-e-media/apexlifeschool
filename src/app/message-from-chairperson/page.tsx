import { notFound } from "next/navigation";
import { getMessages } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import MessagePage from "@/components/school/MessagePage";

export const metadata = pageMeta({
  title: "A letter from the Chairperson",
  description: "A letter to families from Subas Neupane, Chairperson of Apex Life School, Chabahil.",
  path: "/message-from-chairperson",
});

export default async function Page() {
  const { chairperson } = await getMessages();

  if (!chairperson) {
    notFound();
  }

  return <MessagePage person={chairperson} heading="A letter from the Chairperson" />;
}
