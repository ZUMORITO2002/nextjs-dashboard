import React from 'react'



async function getData() {
    const res = await fetch('http://127.0.0.1:8000/list_customers')
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
  }
   
  export default async function Testlopes() {
    const data = await getData()
   
    return (<>
            <h1>Onil has many auntys</h1>
            <p>{data[0].name}</p>
            </>
)
  }