// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// src/components/content/rehype-image-size.tsx
import getImageSize from "image-size";
import { visit } from "unist-util-visit";
var rehypeImageSize = (options) => {
  return (tree) => {
    visit(tree, { type: "element", tagName: "img" }, (node) => {
      if (node.properties.width || node.properties.height) {
        return;
      }
      const imagePath = `${options?.root ?? ""}${node.properties.src}`;
      const imageSize = getImageSize(imagePath);
      node.properties.width = imageSize.width;
      node.properties.height = imageSize.height;
    });
    visit(tree, { type: "mdxJsxFlowElement", name: "Image" }, (node) => {
      const srcAttr = node.attributes?.find((attr) => attr.name === "src");
      const imagePath = `${options?.root ?? ""}${srcAttr.value}`;
      const imageSize = getImageSize(imagePath);
      const widthAttr = node.attributes?.find((attr) => attr.name === "width");
      const heightAttr = node.attributes?.find(
        (attr) => attr.name === "height"
      );
      if (widthAttr || heightAttr) {
        return;
      }
      node.attributes.push({
        type: "mdxJsxAttribute",
        name: "width",
        value: imageSize.width
      });
      node.attributes.push({
        type: "mdxJsxAttribute",
        name: "height",
        value: imageSize.height
      });
    });
  };
};
var rehype_image_size_default = rehypeImageSize;

// contentlayer.config.ts
var siteUrl = process.env.NEXT_PUBLIC_URL;
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true
    },
    live: {
      type: "boolean",
      description: "Whether the post is live or not",
      required: true,
      default: false
    },
    image: {
      type: "string",
      description: "The path to the cover image"
    },
    description: {
      type: "string",
      description: "The description of the post"
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/blog/${getSlug(post._raw.sourceFileName)}`
    },
    readingTime: {
      type: "number",
      resolve: (post) => calculateReadingTime(post.body.raw)
    },
    slug: {
      type: "string",
      resolve: (post) => getSlug(post._raw.sourceFileName)
    },
    structuredData: {
      type: "object",
      resolve: (doc) => ({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.date,
        description: doc.description,
        image: [siteUrl, doc.image].join(""),
        url: [siteUrl, "blog", doc._raw.flattenedPath].join("/"),
        author: {
          "@type": "Organization",
          name: "KBaseBot"
        }
      })
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "src/content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"]
          }
        }
      ],
      [rehype_image_size_default, { root: process.cwd() }]
    ]
  }
});
function calculateReadingTime(content) {
  const wordsPerMinute = 235;
  const numberOfWords = content.split(/\s/g).length;
  const minutes = numberOfWords / wordsPerMinute;
  return Math.ceil(minutes);
}
function getSlug(fileName) {
  return fileName.replace(".mdx", "");
}
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-NTXKSN3A.mjs.map
