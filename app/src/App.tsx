import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Plot } from "./components/Plot";
import { useGetObjects } from "./api/useGetObjects";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useState } from "react";

const queryClient = new QueryClient();

function Main() {
  const objects = useGetObjects();
  const [isLoadingAtlas, setIsLoadingAtlas] = useState(true);

  if (objects.isLoading) {
    return (
     <LoadingSpinner label="Loading embedding..."/>
    );
  }

  return <>
    <Plot objects={objects} onAtlasLoaded={() => setIsLoadingAtlas(false)} />
    {isLoadingAtlas ? (
      <LoadingSpinner label="Loading images..."/>
    ) : null}
  </>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}

export default App;
