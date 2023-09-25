import type { Post } from "contentlayer/generated";

import If from "@/components/ui/if";
import SubHeading from "@/components/ui/sub-heading";

import DateFormatter from "./date-formatter";
import CoverImage from "./cover-image";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PostHeader: React.FC<{
  post: Post;
  backUrl?: string;
}> = ({ post, backUrl }) => {
  const { title, date, readingTime, description, image } = post;

  // NB: change this to display the post's image
  const displayImage = true;
  const preloadImage = true;

  return (
    <div className={"flex flex-col space-y-4"}>
      <div className={"flex flex-col space-y-4"}>
        <div>
          <Button as={Link} asChild href={backUrl} variant={"outline"}>
            Back to all posts
          </Button>
        </div>
        <Heading type={1}>{title}</Heading>

        <SubHeading>{description}</SubHeading>
      </div>

      <div className="flex">
        <div className="flex flex-row items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <DateFormatter dateString={date} />
          </div>

          <span>·</span>
          <span>{readingTime} minutes reading</span>
        </div>
      </div>

      <If condition={displayImage && image}>
        {(imageUrl) => (
          <div className="relative mx-auto h-[378px] w-full justify-center">
            <CoverImage
              preloadImage={preloadImage}
              className="rounded-md"
              title={title}
              src={imageUrl}
            />
          </div>
        )}
      </If>
    </div>
  );
};

export default PostHeader;
