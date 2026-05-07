import PageTitle from "@/components/blogs/blog/PageTitle";
import Blog from "@/components/blogs/blog/Blog";
import PageMeta from "@/components/common/PageMeta";

const BlogPage = () => {
  return (
    <>
      <PageMeta
        title={"Blog | Amerce - Multipurpose eCommerce Reactjs Template"}
        description={"Amerce - Multipurpose eCommerce Reactjs Template"}
      />
      <PageTitle />
      <Blog />
    </>
  );
};

export default BlogPage;
