import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountOrders from "@/components/account/account-orders/AccountOrders";
import PageMeta from "@/components/common/PageMeta";

const AccountOrdersPage = () => {
  return (
    <>
      <PageMeta
        title={"Your Orders | Amerce - Multipurpose eCommerce Reactjs Template"}
        description={"Amerce - Multipurpose eCommerce Reactjs Template"}
      />
      <AccountPageTitle />
      <AccountOrders />
    </>
  );
};

export default AccountOrdersPage;
