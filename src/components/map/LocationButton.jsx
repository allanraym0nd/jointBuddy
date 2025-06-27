import { useEffect,useState } from "react"

export const LocationButton = () => {
 const [isClicked,setIsClicked] = useState(false)


const handleClick = () => {
    setIsClicked(true)
}

    const getButtonContent = () => {
      if(locationLoading){
        return {
        text: '🤪 fetching location',
        disabled:true,
        className: "bg-blue-500 text-white cursor-not-allowed opacity-75"
        }
        
      }

      if(locationError) {
        return{
            text: "❌ Try Again",
            disabled: false,
            className: "bg-red-500 text-white hover:bg-red-600"
        }
      } 

      

    
    
    
        }

}