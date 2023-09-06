import React from "react";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { Label } from "@/components/ui/label";

const TabRadio = ({
  tabs,
  value,
  onChange,
  label,
  defaultValue,
  showLabel = false,
  className,
}) => {
  return (
    <Tabs
      className={`w-full ${className}`}
      value={value}
      onValueChange={onChange}
      defaultValue={defaultValue}
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
};

export default TabRadio;
