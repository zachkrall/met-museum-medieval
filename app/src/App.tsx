import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Plot } from "./components/Plot";
import { useGetObjects } from "./api/useGetObjects";

const queryClient = new QueryClient();

function Main () {
  const objects = useGetObjects();

  if(objects.isLoading){
    return <div>Loading...</div>
  }

  return <Plot objects={objects} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main/>
    </QueryClientProvider>
  );
}

export default App;
