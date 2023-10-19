import "./App.css";
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {useState} from "react";

const queryClient = new QueryClient()

function App() {


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <h1>SHOPPING LISTS</h1>
        <Shopping></Shopping>
      </QueryClientProvider>
    </>
  )
}

export default App
const fetchLists = async () => {
  const res = await fetch('http://localhost:3001/shopping');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data: string[] = await res.json();
  return data;
};

function Shopping() {
  const [showList, setShowList] = useState<string | null>(null)

  const {isLoading, isError, data, error} = useQuery('lists', fetchLists)

  if(!data){
    return <p>NO DATA</p>
  }


  return <>
    <ul>
      {data.map(list => (
        <li key={list} onClick={() => {setShowList(list)}}>{list}</li>
      ))}
    </ul>
  </>
}
