"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getChatbotPublicId } from "@/modules/chatbots/helpers";
import CopyButton from "@/components/ui/copy-button";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import ColorPicker from "@/components/pickers/color.picker";
import CustomizeForm from "@/modules/chatbots/customize-form";

const Customize = ({ params }) => {
  const { chatbot_id } = params;

  const [formValues, setFormValues] = useState({
    primary_color: "#189641",
  });

  return (
    <DashboardShell className="container max-w-3xl mx-auto">
      <DashboardHeader
        heading={"Customize your chatbot"}
        className="justify-center mt-10"
      />

      <CustomizeForm chatbotId={chatbot_id} />
    </DashboardShell>
  );
};

export default Customize;
