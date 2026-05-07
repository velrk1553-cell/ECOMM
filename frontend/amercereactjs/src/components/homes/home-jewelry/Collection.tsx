import { Link } from "react-router-dom";

function Collection() {
  return (
    <>
      <div className="container">
        <div className="tf-grid-layout md-col-3 gap-20">
          <div className="category-v07 hover-img4">
            <Link to={`/shop-default`} className="cate-image img-style4 mb-15">
              <img
                loading="lazy"
                width={457}
                height={320}
                src="/assets/images/collection/cls-27.jpg"
                alt="Image"
              />
            </Link>
            <div className="cate-content">
              <Link
                to={`/shop-default`}
                className="cate_name h5 fw-medium d-block link mb-8"
              >
                Shine Jewellery Collection
              </Link>
              <Link
                to={`/shop-default`}
                className="btn-action tf-btn-line-2 style-primary"
              >
                <span className="text-caption-01 fw-semibold">Shop Now</span>
              </Link>
            </div>
          </div>
          <div className="category-v07 hover-img4">
            <Link to={`/shop-default`} className="cate-image img-style4 mb-15">
              <img
                loading="lazy"
                width={457}
                height={320}
                src="/assets/images/collection/cls-28.jpg"
                alt="Image"
              />
            </Link>
            <div className="cate-content">
              <Link
                to={`/shop-default`}
                className="cate_name h5 fw-medium d-block link mb-8"
              >
                Luxury Gems Big Sale
              </Link>
              <Link
                to={`/shop-default`}
                className="btn-action tf-btn-line-2 style-primary"
              >
                <span className="text-caption-01 fw-semibold">Shop Now</span>
              </Link>
            </div>
          </div>
          <div className="category-v07 hover-img4">
            <Link to={`/shop-default`} className="cate-image img-style4 mb-15">
              <img
                loading="lazy"
                width={457}
                height={320}
                src="/assets/images/collection/cls-29.jpg"
                alt="Image"
              />
            </Link>
            <div className="cate-content">
              <Link
                to={`/shop-default`}
                className="cate_name h5 fw-medium d-block link mb-8"
              >
                Fresh Sparkle New Arrivals
              </Link>
              <Link
                to={`/shop-default`}
                className="btn-action tf-btn-line-2 style-primary"
              >
                <span className="text-caption-01 fw-semibold">Shop Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Collection;
