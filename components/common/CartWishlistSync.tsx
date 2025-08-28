// "use client";
// import { useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { useShoppingState } from "@/hooks/useShoppingState";
// import CartDropdown from "@/components/common/CartDropdown";
// import WishlistDropdown from "@/components/common/WishlistDropdown";

// /**
//  * CartWishlistSync Component
//  *
//  * This component handles automatic synchronization of cart and wishlist
//  * with the backend when user authentication state changes.
//  *
//  * Place this component in your layout or app component to ensure
//  * automatic syncing whenever the user logs in or out.
//  */
// const CartWishlistSync = () => {
//   const { isAuthenticated } = useAuth();
//   const { syncCartFromBackend, syncWishlistFromBackend, isMounted } =
//     useShoppingState();

//   useEffect(() => {
//     if (isAuthenticated && isMounted) {
//       // Sync both cart and wishlist when user logs in
//       console.log("User authenticated, syncing cart and wishlist...");
//       syncCartFromBackend();
//       syncWishlistFromBackend();
//     }
//   }, [
//     isAuthenticated,
//     syncCartFromBackend,
//     syncWishlistFromBackend,
//     isMounted,
//   ]);

//   // During server side rendering or hydration, don't render anything
//   if (!isMounted) {
//     return null;
//   }

//   return (
//     <div className="flex gap-2">
//       <WishlistDropdown />
//       <CartDropdown />
//     </div>
//   );
// };

// export default CartWishlistSync;
