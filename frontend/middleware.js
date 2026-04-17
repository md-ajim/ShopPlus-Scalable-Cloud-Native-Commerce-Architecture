import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Custom settings for protecting routes
  pages: {
    signIn: "/form/login", // Redirect users who are not authenticated to the login page
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*", "/dashboard",
    '/checkout/payment/:path*' ,'/checkout/payment',
    '/checkout/shipping/:path*' , '/checkout/shipping',
    "/dashboard/orders/account/addresses/add/:path*" ,'/dashboard/orders/account/addresses/add',
    "/dashboard/orders/account/addresses/edit/[id]/:path*" ,'/dashboard/orders/account/addresses/edit/[id]',
    "/dashboard/balance/:path*", "/dashboard/balance",
    "/dashboard/cart/:path*", "/dashboard/cart",
    "/dashboard/customer/save-for-later/:path*", "/dashboard/customer/save-for-later",
     "/dashboard/notifications/:path*", "/dashboard/notifications",
     "/dashboard/orders/:path*", "/dashboard/orders",
    "/dashboard/orders-details/:path*", "/dashboard/orders/orders-details",
    "/dashboard/orders/returns/:path*", "/dashboard/orders/returns",
    "/dashboard/referrals/:path*", "/dashboard/referrals",
      "/dashboard/wishlist/:path*", "/dashboard/wishlist",
    // "/dashboard/price-alerts/:path*", "/dashboard/price-alerts",
    // "/dashboard/shipping-info/:path*", "/dashboard/shipping-info",
    // "/dashboard/profile/:path*", "/dashboard/profile",
    // "/dashboard/users/:path*", "/dashboard/users",

  ], // Protect these pages
};
