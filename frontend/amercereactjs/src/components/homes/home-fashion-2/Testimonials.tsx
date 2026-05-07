import { Link } from "react-router-dom";
import TfSwiper from "@/components/ui/TfSwiper";
import { useTestimonials, apiImageUrl } from "@/hooks/useApi";
import { testimonialFashion2Slides } from "@/data/testimonials";
import { formatPrice } from "@/utils/formatPrice";

function Testimonials() {
  const { testimonials, loading } = useTestimonials();

  const hasApi = !loading && testimonials.length > 0;

  return (
    <section className="flat-spacing pt-0">
      <div className="flat-spacing bg-main">
        <div className="container-full">
          <div className="sect-heading type-2 has-col-right wow fadeInUp">
            <div>
              <h3 className="s-title">What Our Customers Say</h3>
              <p className="s-desc cl-text-2">
                Real stories from people who love our products.
              </p>
            </div>
            <div className="col-right">
              <Link to="/shop-default" className="tf-btn-line-2 py-4 style-primary">
                <span className="fw-semibold">Read All Reviews</span>
              </Link>
            </div>
          </div>

          {hasApi ? (
            <TfSwiper
              preview={3}
              tablet={2}
              mobileSm={1}
              mobile={1}
              spaceLg={40}
              spaceMd={20}
              space={15}
              pagination={1}
              paginationSm={1}
              paginationMd={2}
              paginationLg={3}
              touch={false}
              paginationClassName="sw-line-default style-2 tf-sw-pagination"
            >
              {testimonials.map((t) => (
                <div key={t.id} className="testimonial-v04 style-2 wow fadeInUp">
                  <div className="star-wrap d-flex align-items-center mb-12">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`icon icon-Star${i < t.rating ? "" : "-outline"} fs-24`}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <div className="tes_author d-flex align-items-center gap-8 mb-20">
                    <h6 className="author-name">{t.author_name}</h6>
                    {t.author_title && (
                      <div className="author-verified d-flex align-items-center gap-4">
                        <i className="icon icon-CheckCircle1" aria-hidden />
                        <span className="cl-text-2">{t.author_title}</span>
                      </div>
                    )}
                  </div>
                  <p className="tes_text h6 text-capitalize mb-20">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="br-line mb-20" />
                  {t.product_id && t.product_name && (
                    <div className="tes_product">
                      <div className="product-image">
                        <img
                          src={t.product_image_url ?? apiImageUrl(t.product_thumbnail)}
                          alt={t.product_name}
                          width={60}
                          height={60}
                          loading="lazy"
                        />
                      </div>
                      <div className="product-infor">
                        <Link
                          to={`/product-detail/${t.product_slug ?? t.product_id}`}
                          className="link-underline-primary fw-medium lh-24"
                        >
                          {t.product_name}
                        </Link>
                        <div className="prd_price text-caption-01">
                          {formatPrice(Number(t.product_sale_price ?? t.product_price ?? 0))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </TfSwiper>
          ) : !loading ? (
            <TfSwiper
              preview={3}
              tablet={2}
              mobileSm={1}
              mobile={1}
              spaceLg={40}
              spaceMd={20}
              space={15}
              pagination={1}
              paginationSm={1}
              paginationMd={2}
              paginationLg={3}
              touch={false}
              paginationClassName="sw-line-default style-2 tf-sw-pagination"
            >
              {testimonialFashion2Slides.map((slide) => (
                <div
                  key={slide.authorName + (slide.product?.name ?? "")}
                  className="testimonial-v04 style-2 wow fadeInUp"
                >
                  <div className="star-wrap d-flex align-items-center mb-12">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="icon icon-Star fs-24" aria-hidden />
                    ))}
                  </div>
                  <div className="tes_author d-flex align-items-center gap-8 mb-20">
                    <h6 className="author-name">{slide.authorName}</h6>
                    {slide.verifiedLabel != null && (
                      <div className="author-verified d-flex align-items-center gap-4">
                        <i className="icon icon-CheckCircle1" aria-hidden />
                        <span className="cl-text-2">{slide.verifiedLabel}</span>
                      </div>
                    )}
                  </div>
                  <p className="tes_text h6 text-capitalize mb-20">
                    &quot;{slide.quote}&quot;
                  </p>
                  <div className="br-line mb-20" />
                  {slide.product != null && (
                    <div className="tes_product">
                      <div className="product-image">
                        <img src={slide.product.img} alt={slide.product.name} width={60} height={60} loading="lazy" />
                      </div>
                      <div className="product-infor">
                        <Link to={`/product-detail/${slide.product.id}`} className="link-underline-primary fw-medium lh-24">
                          {slide.product.name}
                        </Link>
                        <div className="prd_price text-caption-01">{formatPrice(slide.product.price)}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </TfSwiper>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
