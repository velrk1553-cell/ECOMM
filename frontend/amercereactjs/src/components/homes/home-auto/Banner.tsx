import { Link } from "react-router-dom";

function Banner() {
  return (
    <>
      <div className="themesFlat">
        <div className="container">
          <div className="tf-grid-layout md-col-2">
            <div className="box-image_v04 type-3">
              <Link to={`/shop-default`} className="box-image_img img-style">
                <img
                  loading="lazy"
                  width={690}
                  height={388}
                  src="/assets/images/section/banner-28.jpg"
                  alt="Image"
                />
              </Link>
              <div className="box-image_content wow fadeInUp">
                <Link
                  to={`/shop-default`}
                  className="title h3 fw-medium text-white link"
                >
                  Power Your <br />
                  Drive
                </Link>
                <p className="desc text-white">
                  Save Big on Performance Parts.
                </p>
                <Link
                  to={`/shop-default`}
                  className="btn-action tf-btn-line-2 style-white"
                >
                  <span className="fw-semibold">Shop Now</span>
                </Link>
              </div>
            </div>
            <div className="box-image_v04 type-3">
              <Link to={`/shop-default`} className="box-image_img img-style">
                <img
                  loading="lazy"
                  width={690}
                  height={388}
                  src="/assets/images/section/banner-22.jpg"
                  alt="Image"
                />
              </Link>
              <div className="box-image_content wow fadeInUp">
                <Link
                  to={`/shop-default`}
                  className="title h3 fw-medium text-white link"
                >
                  Built For The <br />
                  Road
                </Link>
                <p className="desc text-white">Up to 40% Off Repair Tools.</p>
                <Link
                  to={`/shop-default`}
                  className="btn-action tf-btn-line-2 style-white"
                >
                  <span className="fw-semibold">Shop Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
