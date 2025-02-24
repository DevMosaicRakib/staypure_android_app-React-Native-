import { makeRequest } from "./makeRequest";
import  { useEffect, useRef, useState } from 'react'

const useFetch = (endpoint) => {
    const [data,setData] = useState(null);
    

    useEffect(()=>{
        makeApiCall()
    },[endpoint])

    const makeApiCall = async () => {
        const res = await makeRequest(endpoint)
        setData(res)
        // console.log(res);
    }
  return data
}

export default useFetch

// const useFetch = (endpoint) => {
//     const [data, setData] = useState(null);
//     const dataRef = useRef(null); // Ref to track data changes

//     useEffect(() => {
//         const makeApiCall = async () => {
//             const res = await makeRequest(endpoint);
//             if (JSON.stringify(dataRef.current) !== JSON.stringify(res)) { // Check if the data has changed
//                 dataRef.current = res; // Update the ref
//                 setData(res); // Update the state
//             }
//         };

//         makeApiCall();
//     }, [endpoint]);

//     return data;
// };

// export default useFetch;


