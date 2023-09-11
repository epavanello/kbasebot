"use client";

import React from "react";
import { ChromePicker } from "react-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icon } from "@/components/ui/icons";

const ColorPicker = ({ onChange, value, label, resetProp } : {
    onChange: (value: string) => void;
    value: string;
    label?: string;
    resetProp?: () => void;
}
  ) => {
  const reset = () => {
    resetProp?.();
  };

  return (
    <>
      {!!(resetProp || label) && (
        <div className="flex justify-between w-full text-xs">
          {label && (
            <label>
              <span>{label}</span>{" "}
            </label>
          )}
          {!!resetProp && (
            <button onClick={reset}>
              <Icon icon={"system-uicons:reset"} />
            </button>
          )}
        </div>
      )}
      <Popover>
        <PopoverTrigger className="flex flex-col">
          <div className="flex flex-wrap items-center mt-1">
            {value !== "none" ? (
              <div
                className="w-8 h-8 mr-2 border-2 rounded-md shadow-2xl"
                style={{ backgroundColor: value }}
              ></div>
            ) : (
              <div className="w-8 h-8 mr-2 border-2 rounded-md shadow-2xl flex justify-center items-center">
                <Icon icon={"radix-icons:eye-none"} className="text-md" />
              </div>
            )}
            <input
              className="text-[12px] border p-1 font-medium text-muted-foreground bg-muted mt-1"
              value={value}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <ChromePicker
            color={value}
            onChange={(color: any) => {
              // to reset transparency, it require to do.
              onChange(color.hex);
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ColorPicker;
