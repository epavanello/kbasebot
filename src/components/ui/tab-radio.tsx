import React from "react";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { Label } from "@/components/ui/label";

const TabRadio = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      tabs,
      value,
      onChange,
      label,
      defaultValue,
      showLabel = false,
      className,
    },
    ref,
  ) => {
    return (
      <Tabs
        className={`w-full ${className}`}
        value={value}
        onValueChange={onChange}
        defaultValue={defaultValue}
        ref={ref}
      >
        {!!label && <Label className="text-xs">{label}</Label>}
        <TabsList className="flex">
          {tabs?.map((tab) => (
            <TabsTrigger className="w-full" key={tab.label} value={tab.value}>
              <span className={`${showLabel ? "mr-1" : "sr-only"} text-xs`}>
                {tab.label}
              </span>
              <Icon icon={tab.icon} className="text-lg" />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  },
);

TabRadio.displayName = "TabRadio";

export default TabRadio;
