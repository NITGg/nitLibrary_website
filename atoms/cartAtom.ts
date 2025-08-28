import { CartItem } from "@/types/common";
import { atom } from "jotai";



export const cartAtom = atom<CartItem[]>([]);

