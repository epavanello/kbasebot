import React from "react";
import { Post } from "contentlayer/generated";

import PostBody from "./PostBody";
import PostHeader from "./post-header";

const Post: React.FCC<{
  post: Post;
  content: string;
  backUrl?: string;
}> = ({ post, content, backUrl }) => {
  return (
    <div className={"mx-auto my-8 max-w-2xl"}>
      <PostHeader backUrl={backUrl} post={post} />

      <article className={"mx-auto flex justify-center"}>
        <PostBody content={content} />
      </article>
    </div>
  );
};

export default Post;
