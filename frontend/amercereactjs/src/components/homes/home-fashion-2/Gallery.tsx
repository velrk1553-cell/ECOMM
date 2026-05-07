import { Link } from "react-router-dom";
import TfSwiper from "@/components/ui/TfSwiper";
import { useSpecialProducts, apiImageUrl } from "@/hooks/useApi";

function Gallery() {
  const { products, loading } = useSpecialProducts(10);

  if (loading) return null;
  if (!products.length) return null;

  return (
    <div className="themesFlat px-10 pb-40">
      <div className="sect-heading type-2 text-center wow fadeInUp">
        <h3 className="s-title">Our Special Products</h3>
        <p className="s-desc text-body-1 cl-text-2">Handpicked exclusively for you</p>
      </div>
      <TfSwiper
        preview={5}
        tablet={3}
        mobileSm={3}
        mobile={2}
        space={10}
        pagination={2}
        paginationSm={3}
        paginationMd={4}
        paginationLg={5}
        paginationClassName="sw-dot-default tf-sw-pagination"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="gallery-item style-2 hover-img hover-overlay wow fadeInUp"
          >
            {/* Fixed square container — every image same height & width */}
            <div
              className="image img-style"
              style={{ aspectRatio: "1/1", overflow: "hidden", display: "block" }}
            >
              <img
                src={apiImageUrl(product.thumbnail)}
                alt={product.name}
                width={346}
                height={346}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/images/product/product-placeholder.jpg";
                }}
              />
            </div>
            <Link
              to={`/product-detail/${product.id}`}
              className="box-icon hover-tooltip rounded-circle"
            >
              <span className="icon icon-Eye" aria-hidden />
              <span className="tooltip">{product.name}</span>
            </Link>
          </div>
        ))}
      </TfSwiper>
    </div>
  );
}

export default Gallery;
