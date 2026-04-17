// types/review.ts
export interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  date: string;
  title: string;
  comment: string;
  likes: number;
  dislikes: number;
  attributes?: {
    size?: string;
    color?: string;
  };
  images?: string[];
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recommendedPercentage: number;
}