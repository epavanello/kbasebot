import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icons";
import InputNote from "@/components/ui/input-note";
import { PreviewContent } from "./preview-content";
import { formatNumber } from "@/lib/utils";
import { useState } from "react";

export interface Item<T> {
  id: string;
  value: string;
  chars: number;
  trained?: boolean;
  data: T;
}
interface Props<T> {
  items: Item<T>[];
  title: string;
  onDelete: (item: Item<T>) => Promise<void>;
  onDeleteAll?: () => Promise<void>;
  type: "url" | "doc" | "notion" | "qa";
}
export default function ContentList<T>({ items, title, onDelete, onDeleteAll, type }: Props<T>) {
  const [deleting, setDeleting] = useState<string[]>([]);
  const [deletingAll, setDeletingAll] = useState(false);

  const handleDelete = async (item: Item<T>) => {
    setDeleting((prev) => [...prev, item.id]);
    try {
      await onDelete(item);
    } finally {
      setDeleting((prev) => prev.filter((id) => id !== item.id));
    }
  };

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      await onDeleteAll?.();
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="max-h-[50vh] w-full overflow-auto border border-dashed p-4">
      <div className="flex justify-between gap-4">
        <h1 className="my-1 text-center font-bold">{title}</h1>

        {onDeleteAll && (
          <Button
            type="button"
            onClick={handleDeleteAll}
            variant="destructive"
            size={"sm"}
            className="h-auto bg-none text-xs"
            disabled={!items.length || deletingAll}
            loading={deletingAll}
          >
            <Icon className={"text-md mr-1"} icon={"ph:trash"} /> Delete All
          </Button>
        )}
      </div>

      <ul className="flex flex-col gap-2 overflow-y-auto p-2">
        {items.map((item) => (
          <li key={item.id} className="flex flex-row items-center gap-2">
            <div className="relative flex flex-1 flex-row items-center gap-2">
              <PreviewContent id={item.id} type={type} />
              <Input className="h-8 text-sm" value={item.value} readOnly />
              <InputNote>{formatNumber(item.chars)} chars</InputNote>
            </div>
            {!!item.trained ? (
              <Icon icon="ph:check" className="text-green-500" />
            ) : (
              // cloud
              <Icon icon="material-symbols:cloud-outline" className="text-yellow-500" />
            )}

            <Button
              type="button"
              onClick={() => handleDelete(item)}
              variant="ghost"
              size={"sm"}
              className="text-red-500"
              loading={deleting.includes(item.id)}
              disabled={deleting.includes(item.id)}
              icon="ph:trash"
              iconClassName="text-sm"
            ></Button>
          </li>
        ))}
        {!items.length && (
          <li className="flex flex-row items-center gap-2">
            <div className="relative flex flex-1 flex-row items-center gap-2">
              <p className="text-sm text-gray-500">No content found</p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
