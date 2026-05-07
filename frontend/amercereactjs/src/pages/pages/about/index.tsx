import PageTitle from "@/components/pages/about/PageTitle";
import MainAbout from "@/components/pages/about/MainAbout";
import BannerWhyChoose from "@/components/pages/about/BannerWhyChoose";
import Testimonial from "@/components/pages/about/Testimonial";
import Member from "@/components/pages/about/Member";
import PageMeta from "@/components/common/PageMeta";

const AboutPage = () => {
  return (
    <>
      <PageMeta
        title={"About Us | Amerce - Multipurpose eCommerce Reactjs Template"}
        description={"Amerce - Multipurpose eCommerce Reactjs Template"}
      />
      <PageTitle />
      <MainAbout />
      <BannerWhyChoose />
      <Testimonial />
      <Member />
    </>
  );
};

export default AboutPage;
