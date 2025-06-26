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

        navigator.geolocation.getCurrentPosition(
            //success callback
            (position) => {
                const {latitude, longitude} =position.coords
                setLocation({lat: latitude, lng: longitude})
                setLoading(false)
                console.log('Location Detected', {latitude, longitude})
            },

            (error) =>{
            let errorMessage = 'Could not find location'
            switch(error.code) {
                case error.PERMISSION_DENIED:
                errorMessage = 'Location Denied by user'
                break
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location Information Unavailable'
                    break
                case error.TIMEOUT:
                    errorMessage = 'Location request timeout'
                


            }
            


            }
        )
 
    
    }

}