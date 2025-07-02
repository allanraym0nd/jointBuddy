import RestaurantCard from "./RestaurantCard";

const ResturantSidebar = (selectedRestaurantId, restaurants, onRestaurantClick) =>{
    return (
        <div className="restaurant-sidebar">
      <div className="sidebar-header">
        <h2>Nearby Restaurants</h2>
        <p>{restaurants.length} restaurants found</p>
      </div>

      <div className = "restaurant-list">
        {restaurants.map((restaurant) => (
            <ResturantSidebar 
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