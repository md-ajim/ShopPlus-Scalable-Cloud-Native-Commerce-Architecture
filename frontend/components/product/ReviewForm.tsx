'use client'

import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";


interface ReviewFormType {
  rating: number,
  title: string,
  name: string,
  email: string,
  images:File[],
  text: string,
}


export default function ReviewForm( props : { product: any }  ) {

  const { product } = props

  console.log(product, 'product from review form    rev ')

  const [hover, setHover] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession() 

  const [reviewFormControl, setReviewFormControl] = useState<ReviewFormType>({
    rating: 0,
    title: '',
    name: '',
    email: '',
    images: [],
    text: ''
  })


const handleSubmit = async (event: any) => {
  event.preventDefault()
  setIsLoading(true)

  const formData = new FormData()

  formData.append('rating', reviewFormControl.rating.toString())
  formData.append('title', reviewFormControl.title)
  formData.append('product', product?.id.toString())
  formData.append('name', reviewFormControl.name)
  formData.append('user', session?.user?.id )
  formData.append('email', reviewFormControl.email)
  formData.append('text', reviewFormControl.text)


  if (reviewFormControl.images?.length > 0) {
    reviewFormControl.images.forEach((image: File) => {
      formData.append('images', image)
    })
  }

  try {
    const res = await axios.post(
      "/api/api/reviews/",
      formData
    )

    toast.success("Review Submitted Successfully")
    console.log(res, 'res from post request in review form')
  } catch (error) {
    console.log(error)
  } finally {
    setIsLoading(false)
  }
}



console.log(reviewFormControl, 'review form control')

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Your Rating</Label>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <button
                  key={index}
                  type="button"
                  className="p-1"
                  // onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setReviewFormControl({ ...reviewFormControl, rating: ratingValue })}
                >
                  <Star
                    className={`h-6 w-6 ${ratingValue <= (hover || reviewFormControl.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                      }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="py-2" htmlFor="review-title">Review Title</Label>
          <input
            id="review-title"
            type="text"
            value={reviewFormControl.title}
            onChange={(event) => setReviewFormControl({ ...reviewFormControl, title: event.target.value })}
            placeholder="Summarize your experience"
            className="w-full rounded-md border  px-3 py-2 text-sm"
          />
        </div>

        <div>
          <br />
          <Label className="py-2" htmlFor="review-text">Your Review</Label>
          <Textarea
            id="review-text"
            value={reviewFormControl.text}
            className="w-full rounded-md border px-3 py-2 text-sm"
            onChange={(event) => setReviewFormControl({ ...reviewFormControl, text: event.target.value })}
            placeholder="Share details about your experience with this product"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <br />
            <Label className="py-2" htmlFor="name">Name</Label>
            <input
              id="name"
              type="text"
              value={reviewFormControl.name}
              placeholder="Your name"
              className="w-full rounded-md border px-3 py-2 text-sm"
              onChange={(event) => setReviewFormControl({ ...reviewFormControl, name: event?.target.value })}
            />
          </div>
          <div>
            <br />
            <Label className="py-2" htmlFor="email">Email</Label>
            <input
              id="email"
              type="email"
              value={reviewFormControl.email}
              onChange={(event) => setReviewFormControl({ ...reviewFormControl, email: event.target.value })}
              placeholder="Your email"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>


        <div>
          <input className="cursor-pointer py-2   rounded-lg px-2 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full shadow-xs placeholder:text-body" onChange={(event) => setReviewFormControl({ ...reviewFormControl, images: event.target.files ? Array.from(event.target.files): '' })} type="file" accept="image/*" multiple />

        </div>

        <div className="flex justify-end">
          <Button type="submit"> { isLoading ? 'Submitting...' : 'Submit Review' } </Button>
        </div>
      </form>
    </div>
  );
}