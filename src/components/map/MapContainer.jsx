import LoadingSpinner from "../common/LoadingSpinner";
import { useState, useEffect } from "react";

const MapContainer = () => {
    const[isLoading,setIsLoading]= useState(true); 

 useEffect(() =>{
setTimeout(()=> setIsLoading(false), 2000)
 },[])

    if(isLoading){
        return (
            <LoadingSpinner size='lg'/>
        )
    }

   return (
    <div className="w-full h-full bg-blue-50 flex items-center justify-center"> 
    </div>
  )
}

export default MapContainer;
