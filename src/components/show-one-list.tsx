import {useQuery} from "react-query";

const fetchList = async (name: string) => {
  const res = await fetch(`http://localhost:3001/shopping/${name}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data: {[index: string]: number} = await res.json();
  return data;
};

export function ShowOneList({name}:{name: string}){
  const {data} = useQuery(name, () => fetchList(name))

  if(!data){
    return null
  }

  return <>
    <ul>
      {Object.entries(data).map(([key, value]) =>
        <li key={key}>{key}: {value}<sup> pcs.</sup></li>
      )}
    </ul>
  </>
}
