import {useState} from "react";
import {useQuery} from "react-query";
import {ShowOneList} from "./show-one-list.tsx";

const fetchLists = async () => {
  const res = await fetch('http://localhost:3001/shopping');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data: string[] = await res.json();
  return data;
};

export function ShoppingLists() {
  const [showList, setShowList] = useState<string | null>(null)

  const {data} = useQuery('lists', fetchLists)

  if(!data){
    return <p>NO DATA</p>
  }


  return <>
    <ul>
      {data.map(list => (
        <li key={list} onClick={() => {setShowList(list)}}>{list}</li>
      ))}
    </ul>
    {showList ? <ShowOneList name={showList}/> : <p></p>}
  </>
}
