// src/components/sidebar/RestaurantCard.jsx
const RestaurantCard = ({ restaurant, onClick, isSelected }) => {
  const handleClick = () => {
    onClick(restaurant)
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-md mb-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      {/* Restaurant image with favorite button */}
      <div className="w-full h-36 relative">
        <img 
          src={restaurant.photoUrl} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <button 
          className="absolute top-3 right-3 bg-white/90 border-0 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer text-red-500 text-lg"
          onClick={(e) => {
            e.stopPropagation()
            // Handle favorite toggle logic here
          }}
        >
          ♡
        </button>
      </div>
      
      {/* Restaurant info */}
      <div className="p-4">
        <div className="text-lg font-semibold mb-2 text-gray-800">
          {restaurant.name}
        </div>
        
        <div className="flex items-center gap-2 mb-2 text-gray-600 text-sm">
          <span className="text-yellow-400">
            ⭐⭐⭐⭐⭐ {restaurant.rating}
          </span>
          <span>•</span>
          <span>{"$".repeat(restaurant.priceLevel)}</span>
          <span>•</span>
          <span>{restaurant.distance} mi</span>
        </div>
        
        <div className="text-gray-600 text-sm mb-3">
          {restaurant.cuisine} • {restaurant.isOpen ? 'Open' : 'Closed'}
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <button className="flex-1 py-2 px-3 border border-gray-300 bg-red-500 text-white rounded-md cursor-pointer text-xs transition-all duration-200 hover:bg-red-600 flex items-center justify-center gap-1">
            🧭 Directions
          </button>
          <button className="flex-1 py-2 px-3 border border-gray-300 bg-white text-gray-700 rounded-md cursor-pointer text-xs transition-all duration-200 hover:bg-gray-50 hover:border-red-500 flex items-center justify-center gap-1">
            📞 Call
          </button>
          <button className="flex-1 py-2 px-3 border border-gray-300 bg-white text-gray-700 rounded-md cursor-pointer text-xs transition-all duration-200 hover:bg-gray-50 hover:border-red-500 flex items-center justify-center gap-1">
            📄 Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard