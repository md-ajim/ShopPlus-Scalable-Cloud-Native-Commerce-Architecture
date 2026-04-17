import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase";

export const requestPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BFPoiMq795hMATREpW2cm-ruoB9_rj1xVYryaqTenctVY4EJHT4PScK3dndNj3sgKiAVSZRr6Noh5PHC-VBWMN4"
    });

    return token;
  }
};
