"use client";

import React from "react";
import { ChromePicker } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icon } from "@/components/ui/icons";

const ColorPicker = ({
  onChange,
  value,
  label,
  resetProp,
}: {
  onChange: (value: string) => void;
  value: string;
  label?: string;
  resetProp?: () => void;
}) => {
  const reset = () => {
    resetProp?.();
  };

  return (
    <>
      {!!(resetProp || label) && (
        <div className="flex w-full justify-between text-xs">
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
          <div className="mt-1 flex flex-wrap items-center">
            {value !== "none" ? (
              <div className="mr-2 h-8 w-8 rounded-md border-2 shadow-2xl" style={{ backgroundColor: value }}></div>
            ) : (
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md border-2 shadow-2xl">
                <Icon icon={"radix-icons:eye-none"} className="text-md" />
              </div>
            )}
            <input className="mt-1 border bg-muted p-1 text-[12px] font-medium text-muted-foreground" value={value} />
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
