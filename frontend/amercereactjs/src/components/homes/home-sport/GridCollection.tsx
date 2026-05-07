import { Link } from "react-router-dom";

function GridCollection() {
  return (
    <>
      <div className="grid-cls-layout grid-cls-v3">
        <div className="item1 banner-v04 style-2 rounded-0">
          <div className="bn_image h-100">
            <img
              className="aspect-ratio-0"
              loading="lazy"
              width={1260}
              height={770}
              src="/assets/images/section/banner-59.jpg"
              alt="Image"
            />
          </div>
          <div className="bn_content">
            <div className="wrap wow fadeInUp">
              <h1 className="title mb-8">
                <Link
                  to={`/shop-default`}
                  className="text-white link-underline-white text-decoration-thickness_3"
                >
                  Pickleball: Your <br className="" />
                  Next Obsession.
                </Link>
              </h1>
              <p className="desc text-body-1 text-white mb-36">
                Up to 50% Off Accessories
              </p>
              <Link to={`/shop-default`} className="tf-btn btn-white">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        <div className="item2 box-cls-v1 style-3 hover-img">
          <Link to={`/shop-default`} className="cls-image img-style rounded-0">
            <img
              loading="lazy"
              width={690}
              height={446}
              src="/assets/images/section/banner-60.jpg"
              alt="Image"
            />
          </Link>
          <div className="cls-content wow fadeInUp">
            <Link
              to={`/shop-default`}
              className="cls_title h3 text-white mb-4 link-underline-white text-decoration-thickness_3"
            >
              Precision Gear <br />
              Ultimate Game
            </Link>
            <p className="cls_desc text-white mb-20">
              Up to 50% Off Bestsellers
            </p>
            <Link
              to={`/shop-default`}
              className="tf-btn-line-2 style-white py-4"
            >
              <span className="fw-semibold text-caption-01">Shop Now</span>
            </Link>
          </div>
        </div>
        <div className="item3 box-cls-v1 style-3 hover-img">
          <Link to={`/shop-default`} className="cls-image img-style rounded-0">
            <img
              loading="lazy"
              width={690}
              height={446}
              src="/assets/images/section/banner-61.jpg"
              alt="Image"
            />
          </Link>
          <div className="cls-content wow fadeInUp">
            <Link
              to={`/shop-default`}
              className="cls_title h3 text-white mb-4 link-underline-white text-decoration-thickness_3"
            >
              Peak Performance <br />
              Ultimate Style
            </Link>
            <p className="cls_desc text-white mb-20">
              Up to 50% Off Bestsellers
            </p>
            <Link
              to={`/shop-default`}
              className="tf-btn-line-2 style-white py-4"
            >
              <span className="fw-semibold text-caption-01">Shop Now</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default GridCollection;
