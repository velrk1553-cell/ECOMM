import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountAddresses from "@/components/account/account-addresses/AccountAddresses";
import PageMeta from "@/components/common/PageMeta";

const AccountAddressesPage = () => {
  return (
    <>
      <PageMeta
        title={"My Address | Amerce - Multipurpose eCommerce Reactjs Template"}
        description={"Amerce - Multipurpose eCommerce Reactjs Template"}
      />
      <AccountPageTitle />
      <AccountAddresses />
    </>
  );
};

export default AccountAddressesPage;
