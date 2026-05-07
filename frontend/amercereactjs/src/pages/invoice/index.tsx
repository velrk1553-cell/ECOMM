import InvoiceContent from "@/components/pages/invoice/InvoiceContent";
import PageMeta from "@/components/common/PageMeta";

const InvoicePage = () => {
  return (
    <>
      <PageMeta
        title={"Invoice | Amerce - Multipurpose eCommerce Reactjs Template"}
        description={"Amerce - Multipurpose eCommerce Reactjs Template"}
      />
      <InvoiceContent />
    </>
  );
};

export default InvoicePage;
