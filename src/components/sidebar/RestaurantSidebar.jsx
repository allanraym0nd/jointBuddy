
import RestaurantCard from './RestaurantCard'

const RestaurantSidebar = ({ restaurants, onRestaurantClick, selectedRestaurantId }) => {
  return (
    <div className="w-96 h-full bg-white flex flex-col shadow-lg">
      
      
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          Your buddy found {restaurants.length} spots nearby! 🎉
        </h2>
        <p className="text-sm text-gray-600">
          Within 2 miles of Downtown Seattle
        </p>
      </div>
      
     
      <div className="flex-1 overflow-y-auto p-4">
        {restaurants.map(restaurant => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={onRestaurantClick}
            isSelected={selectedRestaurantId === restaurant.id}
          />
        ))}
      </div>
    </div>
  )
}

export default RestaurantSidebar