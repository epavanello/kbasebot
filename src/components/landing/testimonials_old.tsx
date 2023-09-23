import React from "react";

import { Carousel, CarouselItem } from "@/components/ui/carousel";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Testimonials = () => {
  return (
    <div>
      <h1 className="text-center text-6xl font-bold">Testimonials</h1>
      <Carousel
        autoplay
        delay={0}
        speed={2000}
        infinite={true}
        visibleItems={3}
        gap={50}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
          <CarouselItem key={i.toString()}>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  Slide {i}
                </CardTitle>
                <CardDescription>Slide {i} Description</CardDescription>
              </CardHeader>
              <CardContent>Slide 1 Content</CardContent>
            </Card>
          </CarouselItem>
        ))}
        {/* More CarouselItems... */}
      </Carousel>
    </div>
  );
};

export default Testimonials;
