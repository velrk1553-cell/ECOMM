import { Link } from "react-router-dom";

function Banner() {
  return (
    <>
      <div className="themesFlat">
        <div className="container">
          <div className="banner-image-text type-abs style-2">
            <Link to={`/shop-default`} className="bn-image img-style">
              <img
                loading="lazy"
                width={1410}
                height={460}
                src="/assets/images/section/banner-9.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content wow fadeInUp">
              <Link
                to={`/shop-default`}
                className="title h1 fw-medium text-white link"
              >
                Precision at <br className="d-none d-sm-block" />
                Your Fingertips
              </Link>
              <p className="desc text-white text-body-1">
                Unleash Speed, Accuracy, and Control for the
                <br className="d-none d-sm-block" />
                Ultimate Gaming Edge!
              </p>
              <Link
                to={`/shop-default`}
                className="btn-action tf-btn btn-white"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
