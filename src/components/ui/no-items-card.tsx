import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const NoItemsCard = ({ title, text, children }) => {
  return (
    <Card className="bg-transparent">
      <CardContent>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-3xl  font-bold">{title}</h2>
          <p className="mt-2 text-center text-gray-500">{text}</p>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default NoItemsCard;
