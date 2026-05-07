import AccountSidebar from "./AccountSidebar";

type AccountSectionProps = {
  title: string;
  /** Extra section classes (e.g. orders tabs use `flat-animate-tab`) */
  sectionClassName?: string;
  children: React.ReactNode;
};

export function AccountSection({
  title: _title,
  sectionClassName = "flat-spacing",
  children,
}: AccountSectionProps) {
  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <AccountSidebar />
          </div>
          <div className="col-lg-9">
            <div className="my-account-content">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
