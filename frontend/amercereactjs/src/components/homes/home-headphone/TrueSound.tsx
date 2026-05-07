import { Link } from "react-router-dom";

function TrueSound() {
  return (
    <>
      <div className="container flat-spacing">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="banner-v05 text-center">
              <div className="bn_image">
                <p className="text-color-image clip-text-bg-vertical">
                  True Sound
                </p>
                <div className="image">
                  <img
                    loading="lazy"
                    width={454}
                    height={331}
                    src="/assets/images/section/true-sound.png"
                    alt="Image"
                  />
                </div>
              </div>
              <div className="bn_content">
                <h3 className="title">
                  Smarter Sound, Deeper Immersion:{" "}
                  <br className="d-none d-md-block" />
                  Tech, Comfort, Performance
                </h3>
                <p className="desc cl-text-2">
                  Explore our innovative range engineered for pristine audio
                  clarity and ergonomic comfort.{" "}
                  <br className="d-none d-md-block" />
                  Upgrade how you listen with cutting-edge intelligent
                  technology.
                </p>
                <Link to={`/shop-default`} className="tf-btn animate-btn">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrueSound;
