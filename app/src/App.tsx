import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Plot } from "./components/Plot";
import { useGetObjects } from "./api/useGetObjects";
import { LoaderIcon } from "lucide-react";

const queryClient = new QueryClient();

function Main() {
  const objects = useGetObjects();

  if (objects.isLoading) {
    return (
      <div
        className={
          "fixed inset-0 bg-black text-white grid place-content-center"
        }
      >
        <div className={"flex flex-col gap-4"}>
          <LoaderIcon className={"size-4 animate-spin opacity-50"} />
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return <Plot objects={objects} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}

export default App;
