import { WishlistItem } from "@/types/common";
import { atom } from "jotai";

export const wishlistAtom = atom<WishlistItem[]>([]);
