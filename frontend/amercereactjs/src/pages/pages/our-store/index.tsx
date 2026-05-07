import PageTitle from "@/components/pages/our-store/PageTitle";
import OurStore from "@/components/pages/our-store/OurStore";
import PageMeta from "@/components/common/PageMeta";

const OurStorePage = () => {
  return (
    <>
      <PageMeta
        title={"Our Store | Amerce - Multipurpose eCommerce Reactjs Template"}
        description={"Amerce - Multipurpose eCommerce Reactjs Template"}
      />
      <PageTitle />
      <OurStore />
    </>
  );
};

export default OurStorePage;
