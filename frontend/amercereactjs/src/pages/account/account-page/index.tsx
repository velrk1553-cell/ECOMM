import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountDashboard from "@/components/account/account-page/AccountDashboard";
import PageMeta from "@/components/common/PageMeta";

const AccountPage = () => {
  return (
    <>
      <PageMeta
        title={"My Account | Amerce - Multipurpose eCommerce Reactjs Template"}
        description={"Amerce - Multipurpose eCommerce Reactjs Template"}
      />
      <AccountPageTitle />
      <AccountDashboard />
    </>
  );
};

export default AccountPage;
