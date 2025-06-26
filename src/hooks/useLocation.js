import { useState,useEffect,useRef } from "react"

export const useLocation =()=> {
    const[location,setLocation]=useState()
    const[error,setError]=useState(null)
    const[loading,setLoading]=useState(false)

    const defaultLocation = {lat:47.6062, lng: -122.3321}

    const getCurrentLocation = () =>{
        setLoading(true)
        setError(null)
    
        if(!navigator.geolocation) {
            setError('Browser does not support automatic detection')
            setLoading(false)
            setLocation(defaultLocation)
            return
        }

        navigator.geolocation
    }

}