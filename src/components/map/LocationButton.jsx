import { useEffect,useState } from "react"

export const LocationButton = ({locationError,locationLoading,onLocationRequest}) => {
 const [isClicked,setIsClicked] = useState(false)


const handleClick = () => {
    setIsClicked(true)
    onLocationRequest()

    setTimeout(()=> setIsClicked(false),2000)
}

    const getButtonContent = () => {
      if(locationLoading){
        return {
        text: '🤪😭 fetching location',
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

      if(isClicked) {
        return{
            text:'',
            disable:true,
            className: "bg-green-500 text-white cursor-not-allowed"
        }
      }

      return {
        text:'📍 Find My Location',
        disabled:false,
        className: "bg-white text-gray-700 hover:bg-gray-50 shadow-lg"
      }

        }

        const buttonConfig = getButtonContent();

    return (
            <button
            onClick={handleClick}
            disabled={buttonConfig.disabled}
            className = {`
                absolute bottom-6 right-6 z-10
                px-4 py-3 rounded-lg font-medium
                border border-gray-200
                transition-all duration-200
                ${buttonConfig.className}`}
            
            >
                {buttonConfig.text}
            </button>
    )

}