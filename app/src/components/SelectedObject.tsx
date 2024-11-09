import { motion } from "framer-motion";
import { useGetObjectById } from "../api/useGetObjectById";
import { XIcon } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { match } from "ts-pattern";

export function SelectedObject({
  id,
  onDismiss,
}: {
  id: string;
  onDismiss: () => void;
}) {
  const query = useGetObjectById({ id });

  return (
    <motion.div className={"fixed inset-0 text-white"}>
      <motion.div
        className={"bg-black/80 fixed inset-0"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className={"fixed inset-0 place-content-center grid overflow-auto p-4"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {match(query)
          .with({ isLoading: true }, () => (
            <LoadingSpinner label={"Loading object..."} />
          ))
          .with({ isError: true }, () => (
            <div className={"w-full max-w-xl flex flex-col items-center"}>
              <div className={"text-center py-4"}>
                <h1 className={"text-3xl font-display"}>Alas, woe betide us</h1>
                <p className={"pt-2"}>This object could not be retrieved</p>
              </div>
              <div className={"flex justify-center"}>
                <button
                  onClick={onDismiss}
                  className={
                    "border border-white rounded-full size-12 grid place-content-center hover:bg-white hover:text-black"
                  }
                >
                  <XIcon className={"size-4"} />
                </button>
              </div>
            </div>
          ))
          .otherwise(({ data }) => {
            return (
              <div className={"w-full max-w-xl flex flex-col items-center"}>
                <div
                  className={
                    "shrink-0 grow-0 relative w-full max-w-96 [transform:translateZ(0)] select-none"
                  }
                >
                  <LoadingSpinner label={""} showBackground={false} />
                  <img
                    src={data?.primaryImage}
                    className={"relative w-full h-auto max-h-96 object-contain"}
                  />
                </div>
                <div className={"text-center py-4"}>
                  <h1 className={"text-3xl font-display"}>
                    {data?.title} ({data?.objectDate})
                  </h1>
                  <p className={"pt-2"}>{data?.medium}</p>
                </div>
                <div className={"flex justify-center"}>
                  <button
                    onClick={onDismiss}
                    className={
                      "border border-white rounded-full size-12 grid place-content-center hover:bg-white hover:text-black"
                    }
                  >
                    <XIcon className={"size-4"} />
                  </button>
                </div>
              </div>
            );
          })}
      </motion.div>
    </motion.div>
  );
}
