import {useState} from "react";
import {useMutation, useQuery} from "react-query";
import {ShowOneList} from "./show-one-list.tsx";

const fetchLists = async () => {
  const res = await fetch('http://localhost:3001/shopping');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data: string[] = await res.json();
  return data;
};

const addList = async ({name} : {name: string}) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({name})
  }
  const res = await fetch(`http://localhost:3001/shopping`, options);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data: {[index: string]: number} = await res.json();
  return data;
};

const deleteList = async ({name} : {name: string}) => {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  }
  const res = await fetch(`http://localhost:3001/shopping/${name}`, options);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data: {[index: string]: number} = await res.json();
  return data;
};

export function ShoppingLists() {
  const [showList, setShowList] = useState<string | null>(null)

  const {data, refetch} = useQuery('lists', fetchLists)

  const [name, setName] = useState("")
  const mutation = useMutation({mutationFn: addList, onSuccess: refetch})
  const deleteMutation = useMutation({mutationFn: deleteList, onSuccess: refetch})


  if(!data){
    return <p>NO DATA</p>
  }


  return <>
    <input onChange={(event) => setName(event.target.value)}/><button onClick={() => mutation.mutate({name})}>Add list</button>
   <h2>Lists:</h2>
    <ul>
      {data.map(list => (
        <li key={list} onClick={() => {setShowList(list)}}>{list} <button onClick={() => deleteMutation.mutate({name: list})}>Delete</button></li>
      ))}
    </ul>
    {showList ? <ShowOneList name={showList}/> : <p></p>}
  </>
}
