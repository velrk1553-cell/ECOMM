import { Navigate, useParams } from "react-router-dom";

import PageMeta from "@/components/common/PageMeta";
import PageTileSingle from "@/components/blogs/blog-single/PageTileSingle";
import BlogSingle from "@/components/blogs/blog-single/BlogSingle";
import Related from "@/components/blogs/blog-single/Related";
import { getAdjacentBlogPosts, getBlogPostById } from "@/data/blogs";

const siteName = "Amerce - Multipurpose eCommerce Reactjs Template";

export default function BlogSingleDynamicPage() {
  const { id = "" } = useParams<{ id: string }>();
  const post = getBlogPostById(id);
  if (!post) return <Navigate to="/404" replace />;

  const pageMeta = {
    title: `${post.title} | ${siteName}`,
    description: post.desc.slice(0, 160),
  };
  const { prev, next } = getAdjacentBlogPosts(id);

  return (
    <>
      <PageMeta title={pageMeta.title} description={pageMeta.description} />
      <PageTileSingle title={post.title} prevId={prev?.id} nextId={next?.id} />
      <BlogSingle post={post} prevPost={prev} nextPost={next} />
      <Related currentId={post.id} />
    </>
  );
}
