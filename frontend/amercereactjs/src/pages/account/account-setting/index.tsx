import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountSetting from "@/components/account/account-setting/AccountSetting";
import PageMeta from "@/components/common/PageMeta";

const AccountSettingPage = () => {
  return (
    <>
      <PageMeta
        title={"Setting | Amerce - Multipurpose eCommerce Reactjs Template"}
        description={"Amerce - Multipurpose eCommerce Reactjs Template"}
      />
      <AccountPageTitle />
      <AccountSetting />
    </>
  );
};

export default AccountSettingPage;
