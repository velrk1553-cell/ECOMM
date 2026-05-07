import { useCallback, useState, type ReactNode } from "react";
import type { ProductSingleImage } from "@/types/productCard";
import type { ColorOption, SizeOption } from "./productContextTypes";
import { ProductContext, type ProductContextType } from "./productContextCore";

export interface ProductProviderProps {
  children: ReactNode;
  initialColor?: string;
  initialSize?: string;
  initialQuantity?: number;
  extraImages: ProductSingleImage[];
  sizes: SizeOption[];
  colors: ColorOption[];
  thumbnailPosition?: "bottom" | "left" | "right";
  zoomType?: "default" | "inner" | "magnifying" | "none";
}

export function ProductProvider({
  children,
  initialColor = "green",
  initialSize = "",
  initialQuantity = 1,
  extraImages,
  sizes,
  colors,
  thumbnailPosition = "left",
  zoomType = "default",
}: ProductProviderProps) {
  const [pane, setPane] = useState<HTMLElement | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [currentSize, setCurrentSize] = useState(
    initialSize || (sizes.length > 0 ? sizes[0].value : ""),
  );
  const [quantity, setQuantity] = useState(initialQuantity);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const registerPane = useCallback((el: HTMLElement | null) => {
    setPane(el);
  }, []);

  const value: ProductContextType = {
    pane,
    registerPane,
    isZooming,
    setIsZooming,
    currentColor,
    setCurrentColor,
    currentSize,
    setCurrentSize,
    quantity,
    setQuantity,
    extraImages,
    sizes,
    colors,
    thumbnailPosition,
    zoomType,
    activeImageIndex,
    setActiveImageIndex,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
