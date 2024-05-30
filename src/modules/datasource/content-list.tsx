import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icons";
import InputNote from "@/components/ui/input-note";

export interface Item<T> {
  id: string;
  value: string;
  chars: number;
  trained?: boolean;
  data?: T;
}
interface Props<T> {
  items: Item<T>[];
  title: string;
  onDelete: (item: Item<T>) => void;
  onDeleteAll?: () => void;
}
export default function ContentList<T>({ items, title, onDelete, onDeleteAll }: Props<T>) {
  return (
    <div className="max-h-[50vh] w-full overflow-auto border border-dashed bg-secondary p-4">
      {onDeleteAll && (
        <div className="flex justify-between gap-4">
          <h1 className="my-1 text-center font-bold">{title}</h1>
          <Button
            type="button"
            onClick={() => onDeleteAll()}
            variant="destructive"
            size={"sm"}
            className="h-auto bg-none text-xs"
            disabled={!items.length}
          >
            <Icon className={"text-md mr-1"} icon={"ph:trash"} /> Delete All
          </Button>
        </div>
      )}

      <ul className="flex flex-col gap-2 overflow-y-auto p-2">
        {items.map((item) => (
          <li key={item.id} className="flex flex-row items-center gap-2">
            <div className="relative flex-1">
              <Input className="h-8 text-sm" value={item.value} readOnly />
              <InputNote>{item.chars} chars</InputNote>
            </div>
            {!!item.trained ? (
              <Icon icon="ph:check" className="text-green-500" />
            ) : (
              // cloud
              <Icon icon="material-symbols:cloud-outline" className="text-yellow-500" />
            )}

            <Button type="button" onClick={() => onDelete(item)} variant="ghost" size={"sm"} className="text-red-500">
              <Icon icon={"ph:trash"} />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
