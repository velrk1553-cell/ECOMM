import PageTitle from "@/components/pages/compare/PageTitle";
import Compare from "@/components/pages/compare/Compare";
import PageMeta from "@/components/common/PageMeta";

const ComparePage = () => {
  return (
    <>
      <PageMeta
        title={"Compare | Amerce - Multipurpose eCommerce Reactjs Template"}
        description={"Amerce - Multipurpose eCommerce Reactjs Template"}
      />
      <PageTitle />
      <Compare />
    </>
  );
};

export default ComparePage;
