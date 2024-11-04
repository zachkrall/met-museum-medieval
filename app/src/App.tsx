import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Plot } from "./components/Plot";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Plot></Plot>
    </QueryClientProvider>
  );
}

export default App;
