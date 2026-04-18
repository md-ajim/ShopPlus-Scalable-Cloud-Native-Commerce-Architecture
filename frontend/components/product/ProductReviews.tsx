import { Review, ReviewStats } from "@/types/review";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, StarHalf, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import ReviewForm from "./ReviewForm";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SessionData } from "@/types/sessionType";
import Image from "next/image";

interface ProductReviewsProps {
  reviews: Review[];
  stats: ReviewStats;
  product: any;
  review_data  : any;

}

export default function ProductReviews({ reviews,  stats , product , review_data  }: ProductReviewsProps) {

  const { data : session} = useSession() as { data : SessionData | null}
  const [ reviewList , setReviewList] = useState <any>(null)  


  const filterData = review_data?.filter((review : any) => review?.product === product.id )



  



  return (
    <div className="space-y-8">

      <Separator />

      {/* Review Form */}
      <ReviewForm product= { product } />

      <Separator />

      {/* Reviews List */}
      <div className="space-y-8">
        {filterData?.map((review : any) => (
          <div key={review.id} className="rounded-lg border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="" >
                  <AvatarImage src={review.name } />
                  <AvatarFallback>
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {review.name || review.user.username }
                    {review.user.username && (
                      <span className="ml-2 text-xs text-blue-500">Verified Buyer</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < review.rating ? (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <Star className="h-4 w-4 text-muted-foreground" />
                          )}
                        </span>
                      ))}
                    </div>
                    <span>•</span>
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {review.attributes && (
                <div className="text-sm text-muted-foreground">
                  {review.attributes.color && (
                    <div>Color: {review.attributes.color}</div>
                  )}
                  {review.attributes.size && (
                    <div>Size: {review.attributes.size}</div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="font-medium">{review.title}</h4>
              <p className="text-muted-foreground">{review.text}</p>

              {review.images.length > 0 && (
                <div className="flex gap-2 pt-2">
                  {review.images.map((image : any, idx : any) => (
                    <div
                      key={idx}
                      className="h-20 w-20 overflow-hidden rounded-md border"
                    >
     
                      <img
                        src={image?.image}
                        alt={`Review image ${idx + 1}`}
                        className="h-full w-full object-cover"
                        layout="cover"
        
                      />
                    </div>
                  ))}
                </div>
              )}
{/* 
              <div className="flex items-center gap-4 pt-3">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{review.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ThumbsDown className="h-4 w-4" />
                  <span>{review.dislikes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Comment</span>
                </Button>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}