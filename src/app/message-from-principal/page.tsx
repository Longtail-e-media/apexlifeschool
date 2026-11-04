import { notFound } from "next/navigation";
import { getMessages } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";
import MessagePage from "@/components/school/MessagePage";

export const metadata = pageMeta({
  title: "A welcome from the Principal",
  description: "A welcome to students and families from Pradyumna Paudel, Principal of Apex Life School, Chabahil.",
  path: "/message-from-principal",
});

export default async function Page() {
  const { principal } = await getMessages();

  if (!principal) {
    notFound();
  }

  return <MessagePage person={principal} heading="A welcome from the Principal" />;
}
