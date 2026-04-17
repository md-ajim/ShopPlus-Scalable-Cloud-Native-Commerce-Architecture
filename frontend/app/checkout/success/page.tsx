"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import type { SessionData } from "@/types/sessionType";
import { useRouter} from "next/navigation";
export default function PaymentSuccessPage() {
  const [OrderDetails, setOrderDetails] = useState<object | null>(null);
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { data: session } = useSession() as { data: SessionData | null };
  const  router = useRouter()
  useEffect(() => {
    if (sessionId) {
      fetch(`/api/success?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrderDetails(data);
          if (data?.order_id && data?.user_id) {
            const response = axios.patch(
              `/api/order/${Number(data.order_id)}/`,
              {
                payment_status: true,
                status: "completed",
              },
              {
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`,
                },
              }
            );
            console.log(
              response.then(() => {
               router.push('/dashboard/orders')
              })
            );
          }
        })
        .catch((err) => console.log(err, "error"));
    }
  }, [sessionId, session]);


  return (
<Suspense>
      <div className="container mx-auto px-4 py-8 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg mb-8">
        Thank you for your order. Your payment has been processed successfully.
      </p>
      <Button onClick={ ()=> router.push('/dashboard/orders')} >View Your Orders</Button>
    </div>
</Suspense>
  );
}
