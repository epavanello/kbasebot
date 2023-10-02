import type { Metadata } from "next";
import { allPosts } from "contentlayer/generated";

// import PostPreview from "@/components/content/post-preview";
import GridList from "@/components/ui/grid-list";
import Container from "@/components/ui/container";
import SubHeading from "@/components/ui/sub-heading";
import Heading from "@/components/ui/heading";
import PostPreview from "@/components/content/post-preview";

export const metadata: Metadata = {
  title: `Blog - KBaseBot`,
  description: `Tutorials, Guides and Updates from our team`,
};

async function BlogPage() {
  return (
    <Container>
      <div className={"flex flex-col space-y-16 my-8"}>
        <div className={"flex flex-col items-center space-y-4"}>
          <Heading type={1}>Blog</Heading>

          <SubHeading>Tutorials, Guides and Updates from our team</SubHeading>
        </div>

        <GridList>
          {allPosts.map((post, idx) => {
            return <PostPreview key={idx} post={post} />;
          })}
        </GridList>
      </div>
    </Container>
  );
}

export default BlogPage;
