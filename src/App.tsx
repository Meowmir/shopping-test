import "./App.css";
import {QueryClient, QueryClientProvider} from 'react-query'
import {ShoppingLists} from "./components/show-lists.tsx";

const queryClient = new QueryClient()

function App() {


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <h1>SHOPPING LISTS</h1>
        <ShoppingLists></ShoppingLists>
      </QueryClientProvider>
    </>
  )
}

export default App
