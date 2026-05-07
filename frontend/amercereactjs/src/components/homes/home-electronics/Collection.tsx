import { Link } from "react-router-dom";

function Collection() {
  return (
    <>
      <section className="section-collection banner-cls">
        <div className="col-left">
          <div className="banner-image-text type-abs style-14 h-100">
            <Link to={`/shop-default`} className="bn-image img-style">
              <img
                loading="lazy"
                width={1290}
                height={860}
                src="/assets/images/slider/electronics/slider-1.jpg"
                alt="Image"
              />
            </Link>
            <div className="bn-content wow fadeInUp">
              <Link
                to={`/shop-default`}
                className="title h1 fw-medium text-white link"
              >
                Hear True Freedom in <br className="d-none d-sm-block" />
                Every Beat
              </Link>
              <h6 className="desc text-body-1 text-white letter-space--1">
                Experience true wireless sound with deep bass, crystal clarity,
                and
                <br className="d-none d-sm-block" />
                seamless connection made for music.
              </h6>
              <Link
                to={`/shop-default`}
                className="btn-action tf-btn btn-white hv-primary"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
        <div className="col-right tf-grid-layout sm-col-2 lg-col-1 gap-10">
          <div className="box-image_v04 hover-img rounded-0">
            <Link to={`/shop-default`} className="box-image_img img-style">
              <img
                loading="lazy"
                width={620}
                height={425}
                src="/assets/images/collection/cls-9.jpg"
                alt="Image"
              />
            </Link>
            <div className="box-image_content wow fadeInUp">
              <Link
                to={`/shop-default`}
                className="title h3 fw-medium link text-white"
              >
                Desktop Sound
              </Link>
              <p className="desc text-body-1 text-white">
                Up to 50% Off Bestsellers.
              </p>
              <Link
                to={`/shop-default`}
                className="btn-action tf-btn-line-2 style-white"
              >
                <span className="fw-semibold">Shop Now</span>
              </Link>
            </div>
          </div>
          <div className="box-image_v04 hover-img rounded-0">
            <Link to={`/shop-default`} className="box-image_img img-style">
              <img
                loading="lazy"
                width={620}
                height={425}
                src="/assets/images/collection/cls-10.jpg"
                alt="Image"
              />
            </Link>
            <div className="box-image_content wow fadeInUp">
              <Link
                to={`/shop-default`}
                className="title h3 fw-medium link text-white"
              >
                Smart watch
              </Link>
              <p className="desc text-body-1 text-white">
                Up to 25% Off Bestsellers.
              </p>
              <Link
                to={`/shop-default`}
                className="btn-action tf-btn-line-2 style-white"
              >
                <span className="fw-semibold">Shop Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Collection;
