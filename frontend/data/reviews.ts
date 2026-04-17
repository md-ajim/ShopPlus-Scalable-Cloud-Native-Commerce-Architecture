// data/reviews.ts
import { Review, ReviewStats } from "@/types/review";
import { headers } from "next/headers";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { SessionData } from "@/types/sessionType";
import { useState } from "react";

export const reviewStats: ReviewStats = {
  averageRating: 4.7,
  totalReviews: 124,
  ratingDistribution: {
    5: 68,
    4: 32,
    3: 12,
    2: 8,
    1: 4,
  },
  recommendedPercentage: 94,
};




export const useReview = () => {

  const { data: session } = useSession() as { data: SessionData | null }
  const [review_data, setReview_data] = useState <any>(null)
console.log( review_data   , "reviews")
  useEffect(() => {
    const getReviewData = async () => {
      const res = await fetch(`/api/reviews/get/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`
        }
      })
      const data = await res.json()
      console.log(data , "data")
  
      if (res.ok) {
      setReview_data(data?.results)
      }
      else {
        return null
      }
    }
    getReviewData()
  },[session])


  return review_data

}



export const reviews: Review[] = [
  {
    id: "1",
    user: {
      name: "Alex Johnson",
      avatar: "/avatars/1.jpg",
      verified: true,
    },
    rating: 5,
    date: "2023-10-15",
    title: "Absolutely love it!",
    comment: "The quality exceeded my expectations. Fits perfectly and looks even better in person than in the photos. Will definitely buy again!",
    likes: 24,
    dislikes: 2,
    attributes: {
      size: "M",
      color: "Navy Blue",
    },
    images: [
      "/products/reviews/1-1.jpg",
      "/products/reviews/1-2.jpg",
    ],
  },
  
  // More reviews...
];