const LoadingSpinner = ({size = 'md' ,  text = 'Loading'}) => {
  const sizeClasses = {
    sm:'w-4 h-4',
    md:'w-8 h-8',
    lg:'w-12 h-12'
  }

  return(
     <div className="flex flex-col items-center justify-center p-4">
       <div className={`${sizeClasses[size]} border-4 border-red-200 border-t-red-500 rounded-full animate-spin`}> </div>
         {text && <p className="mt-2 text-gray-600">{text}</p>}
     </div>
  )
}
export default LoadingSpinner;

// [size] => dynamic lookup in the sizeClass object. 

//sizeClasses => lookup object ; 

// const LoadingSpinner = () => {
//   return (
//     <div className="flex items-center justify-center p-4">
//       <div className="w-8 h-8 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
//     </div>
//   )
// }

// export default LoadingSpinner


