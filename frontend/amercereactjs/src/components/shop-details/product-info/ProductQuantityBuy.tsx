import { Link } from "react-router-dom";
import { useState } from "react";
import { useProduct } from "@/context/useProduct";
import { useContextElement } from "@/context/Context";
import type { ProductCardItem } from "@/types/productCard";
import { formatPrice } from "@/utils/formatPrice";
import { cartAPI } from "@/services/api";

export function ProductQuantityBuy({ product }: { product: ProductCardItem }) {
  const { quantity, setQuantity, currentColor, currentSize } = useProduct();
  const { addProductToCart, isAddedToCartProducts, updateQuantity } =
    useContextElement();
  const isInCart = isAddedToCartProducts(product.id);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);
    try {
      if (isInCart) {
        updateQuantity(product.id, quantity);
        cartAPI.update({ product_id: Number(product.id), quantity }).catch(() => {});
      } else {
        const productWithSelection = {
          ...product,
          selectedColor: currentColor || undefined,
          selectedSize: currentSize || undefined,
        };
        addProductToCart(productWithSelection, quantity);
        cartAPI.add({ product_id: Number(product.id), quantity }).catch(() => {});
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="tf-product-total-quantity">
      <p className="">Quantity:</p>
      <div className="group-action">
        <div className="wg-quantity">
          <button
            type="button"
            className="btn-quantity btn-decrease"
            disabled={quantity <= 1}
            onClick={(e) => {
              e.preventDefault();
              setQuantity(Math.max(1, quantity - 1));
            }}
          >
            <i className="icon icon-minus" />
          </button>
          <input
            className="quantity-product"
            type="text"
            name="number"
            value={quantity}
            readOnly
          />
          <button
            type="button"
            className="btn-quantity btn-increase"
            onClick={(e) => {
              e.preventDefault();
              setQuantity(quantity + 1);
            }}
          >
            <i className="icon icon-plus" />
          </button>
        </div>
        <a
          href="#shoppingCart"
          data-bs-toggle="offcanvas"
          className={`btn-action-price tf-btn type-xl animate-btn w-100${adding ? " disabled" : ""}`}
          onClick={(e) => { e.preventDefault(); handleAddToCart(); }}
        >
          {adding ? "Adding…" : isInCart ? "Update Cart" : "Add To Cart"}
          <span className="d-none d-sm-block d-md-none d-lg-block">
            &nbsp;-&nbsp;
          </span>
          <span className="price-add d-none d-sm-block d-md-none d-lg-block">
            {formatPrice(product.price * quantity)}
          </span>
        </a>
      </div>
      <Link
        to="/checkout"
        className="tf-btn type-xl btn-primary animate-btn w-100"
      >
        Buy It Now
      </Link>
    </div>
  );
}
