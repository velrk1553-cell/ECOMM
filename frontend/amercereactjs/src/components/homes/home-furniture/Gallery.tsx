import { Link } from "react-router-dom";
import TfSwiper from "@/components/ui/TfSwiper";
import { galleryFurnitureItems } from "@/data/gallery";

function Gallery() {
  return (
    <div className="themesFlat flat-spacing pt-0">
      <div className="container-full">
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
          {galleryFurnitureItems.map((item) => (
            <div
              key={item.img}
              className="gallery-item style-2 hover-img hover-overlay wow fadeInUp"
            >
              <div className="image img-style">
                <img
                  src={`${item.img}`}
                  alt={item.alt ?? "Image"}
                  width={346}
                  height={346}
                  loading="lazy"
                />
              </div>
              <Link to="/product-detail/1" className="box-icon hover-tooltip">
                <span className="icon icon-Eye" aria-hidden />
                <span className="tooltip">View product</span>
              </Link>
            </div>
          ))}
        </TfSwiper>
      </div>
    </div>
  );
}

export default Gallery;
