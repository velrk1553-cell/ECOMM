import { Link } from "react-router-dom";
import AddToCartButton from "@/components/common/AddToCartButton";
import {
  ProductCardDualImageLink,
  ProductCardPriceWrap,
} from "./ProductCardParts";
import { useProductCard } from "./useProductCard";

export function ProductCardMiniList() {
  const {
    product,
    wrapperClass,
    cardClass,
    imgWidth,
    imgHeight,
    activeImage,
    activeHoverImage,
    actionBotLabel,
    actionBotHref,
    actionBotDataToggle,
  } = useProductCard();

  return (
    <div className={`card-product product-style_mini_list ${cardClass}`.trim()}>
      <div className={`card-product_wrapper ${wrapperClass}`.trim()}>
        <ProductCardDualImageLink
          productId={product.id}
          activeImage={activeImage}
          hoverImage={activeHoverImage}
          alt={product.name}
          width={imgWidth}
          height={imgHeight}
        />
      </div>
      <div className="card-product_info">
        <Link
          to={`/product-detail/${product.id}`}
          className="name-product lh-24 fw-medium link-underline-text"
        >
          {product.name}
        </Link>
        <ProductCardPriceWrap
          price={product.price}
          priceOld={product.priceOld}
        />
        <AddToCartButton
          product={product}
          href={actionBotHref}
          dataToggle={actionBotDataToggle}
          className="btn-action"
          label={actionBotLabel}
          variant="icon"
        />
      </div>
    </div>
  );
}
