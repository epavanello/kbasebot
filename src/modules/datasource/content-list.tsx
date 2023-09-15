import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icons";

interface Item<T> {
  id: string;
  value: string;
  chars: number;
  uploaded?: boolean;
  data?: T;
}
interface Props<T> {
  items: Item<T>[];
  title: string;
  onDelete: (item: Item<T>) => void;
  onDeleteAll?: () => void;
}
export default function ContentList<T>({
  items,
  title,
  onDelete,
  onDeleteAll,
}: Props<T>) {
  return (
    <div className="w-full bg-secondary p-4 border border-dashed max-h-[50vh] overflow-auto">
      {onDeleteAll && (
        <div className="flex justify-between gap-4">
          <h1 className="text-center font-bold my-1">{title}</h1>
          <Button
            onClick={() => onDeleteAll()}
            variant="destructive"
            size={"sm"}
            className="text-xs h-auto bg-none"
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
              <Input
                className="text-sm h-8 pr-10"
                value={item.value}
                readOnly
              />
              <small className="opacity-50 text-[10px] absolute right-0 bottom-0 px-1 py-1 bg-secondary/50 rounded-lg">
                {item.chars / 1000} kb
              </small>
            </div>
            {!!item.uploaded ? (
              <Icon icon="ph:check" className="text-green-500" />
            ) : (
              <Icon icon="ic:round-upload" className="text-yellow-500" />
            )}

            <Button
              onClick={() => onDelete(item)}
              variant="ghost"
              size={"sm"}
              className="text-red-500"
            >
              <Icon icon={"ph:trash"} />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
