// import LoadingSpinner; 
import { useState, useEffect } from "react";

const MapContainer = () => {
    const[isLoading,setIsLoading]= useState(true); 

 useEffect(() =>{
setTimeout(()=> setIsLoading(false), 2000)
 },[])

    if(isLoading){
        return (
            <LoadingSpinner size='lg' text='Loading Map...'/>
        )
    }

    return (
        <div>

        </div>
    )
}
