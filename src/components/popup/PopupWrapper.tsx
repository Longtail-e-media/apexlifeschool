import { getPopupData } from "@/lib/cms/popup";
import Popup from "@/components/popup/Popup";

/** Server wrapper — fetches popup data then hands it to the client component. */
export default async function PopupWrapper() {
  const popupData = await getPopupData();
  if (!popupData.length) return null;
  return <Popup popupData={popupData} />;
}
