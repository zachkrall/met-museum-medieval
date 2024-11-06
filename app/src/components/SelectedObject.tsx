import { motion } from "framer-motion";
import { useGetObjectById } from "../api/useGetObjectById";
import { XIcon } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

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
        className={"fixed inset-0 place-content-center grid overflow-auto"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {query.isLoading ? (
          <LoadingSpinner label={"Loading object..."} />
        ) : (
          <div className={"max-w-xl flex flex-col items-center"}>
            <div className={'relative size-96 [transform:translateZ(0)] select-none'}>
              <LoadingSpinner label={''} showBackground={false}/>
              <div className={"absolute inset-0 bg-white/0"}>
                <img
                  src={query.data?.primaryImage}
                  className={"size-96 object-contain"}
                />
              </div>
            </div>
            <div className={"text-center py-4"}>
              <h1 className={"text-3xl font-display"}>
                {query.data?.title} ({query.data?.objectDate})
              </h1>
              <p className={"pt-2"}>{query.data?.medium}</p>
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
        )}
      </motion.div>
    </motion.div>
  );
}
