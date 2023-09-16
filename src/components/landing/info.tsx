"use client";
import React from "react";
import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { gradients } from "@/style/gradients";

export default function Info({
  helpText = "Get started quickly",
  title = "Beautiful landing pages",
  desc,
  features,
  dir = "ltr",
  showChild = false,
  children,
  img,
  id,
}: {
  helpText?: string;
  title?: string;
  desc?: string;
  features: { name: string; description: string }[];
  dir?: "ltr" | "rtl";
  showChild?: boolean;
  children?: React.ReactNode;
  img: string;
  id?: string;
}) {
  return (
    <div id={id} className="pt-12 sm:pt-24">
      <div className="mx-auto max-w-7xl">
        <div
          dir={dir}
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"
        >
          <div className="lg:pr-8 lg:pt-4 " dir="ltr">
            <div className="lg:max-w-lg">
              <div>
                {!!helpText && (
                  <h2 className="text-base font-semibold leading-7 text-muted-foreground">
                    {helpText}
                  </h2>
                )}
                {!!title && (
                  <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    {title}
                  </p>
                )}
                {!!desc && <p className="mt-6 text-lg leading-8 ">{desc}</p>}

                <dl className="mt-10 max-w-xl space-y-2 text-base lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="flex flex-col">
                      <dt className="font-semibold whitespace-nowrap flex flex-row items-center">
                        <Icon
                          className={cn("text-md rounded-lg mr-1 text-primary")}
                          icon={"mdi:check-bold"}
                        />
                        {feature.name}
                      </dt>{" "}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          {showChild ? (
            children
          ) : (
            <AspectRatio className={""} ratio={4 / 4}>
              <Image
                src={img}
                alt="Seo"
                className="object-contain max-w-none rounded-xl"
                fill={true}
              />
            </AspectRatio>
          )}
        </div>
      </div>
    </div>
  );
}
