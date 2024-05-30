import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { IconifyIcon } from "@iconify/react";

interface StatCardProps {
  className?: string;
  title: string;
  content: React.ReactNode;
  subtitle?: string;
  icon: IconifyIcon | string;
}

const StatCard: React.FC<StatCardProps> = ({ className, title, content, subtitle, icon }) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon icon={icon} className="text-2xl" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;
