import {useMutation, useQuery} from "react-query";
import {useState} from "react";

const fetchList = async (name: string) => {
  const res = await fetch(`http://localhost:3001/shopping/${name}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data: {[index: string]: number} = await res.json();
  return data;
};

const addItem = async ({name, item} : {name: string, item: string}) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({item})
  }
  const res = await fetch(`http://localhost:3001/shopping/${name}`, options);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data: {[index: string]: number} = await res.json();
  return data;
};

export function ShowOneList({name}:{name: string}){
  const {data, refetch} = useQuery(name, () => fetchList(name))
  const [item, setItem] = useState("")
  const mutation = useMutation({mutationFn: addItem, onSuccess: refetch})

  if(!data){
    return null
  }

  return <>
    <h3>Items in {name}:</h3>
    <ul>
      {Object.entries(data).map(([key, value]) =>
        <li key={key}>{key}: {value}{value === 1 ? <sup> pc.</sup> : <sup> pcs.</sup>}</li>
      )}
    </ul>
    <input onChange={(event) => setItem(event.target.value)}/><button onClick={() => mutation.mutate({name, item})}>Add item</button>
  </>
}
