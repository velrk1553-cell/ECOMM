import TopBar3 from "@/components/topBars/TopBar3";
import Header1 from "@/components/headers/Header1";
import Footer9 from "@/components/footers/Footer9";
import Hero from "@/components/homes/home-fashion-2/Hero";
import Category from "@/components/homes/home-fashion-2/Category";
import Products from "@/components/homes/home-fashion-2/Products";
import ProductThumbs from "@/components/homes/home-fashion-2/ProductThumbs";
import CollectionStyle from "@/components/homes/home-fashion-2/CollectionStyle";
import InfiniteSlide from "@/components/homes/home-fashion-2/InfiniteSlide";
import ProductFeature from "@/components/homes/home-fashion-2/ProductFeature";
import Testimonials from "@/components/homes/home-fashion-2/Testimonials";
import Gallery from "@/components/homes/home-fashion-2/Gallery";
import OfferPopup from "@/components/homes/home-fashion-2/OfferPopup";
import PageMeta from "@/components/common/PageMeta";
export default function HomeFashion2Page() {
  return (
    <>
      <PageMeta
        title="ShopKart Sarees - Pure Silk & Handloom Sarees Online"
        description="Buy authentic Banarasi, Kanjivaram, Paithani and handloom sarees at best prices."
      />
      <TopBar3 />
      <Header1 />
      <>
        <Hero />
        <Category />
        <Products />
        <ProductThumbs />
        <CollectionStyle />
        <InfiniteSlide />
        <ProductFeature />
        <Testimonials />
        <Gallery />
      </>

      <Footer9 parentClass="tf-footer footer-s5 bg-white" />
      <OfferPopup />
    </>
  );
}
