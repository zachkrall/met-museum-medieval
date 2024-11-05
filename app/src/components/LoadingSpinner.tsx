import { LoaderIcon } from "lucide-react";

export function LoadingSpinner({
  label = "Loading...",
  showBackground = false,
}: {
  label?: string;
  showBackground?: boolean;
}) {
  return (
    <div
      className={[
        showBackground ? "bg-black/50" : undefined,
        "fixed inset-0 text-white grid place-content-center",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={"flex flex-col gap-4 items-center"}>
        <LoaderIcon className={"size-4 animate-spin opacity-50"} />
        {label ? <div>{label}</div> : null}
      </div>
    </div>
  );
}
