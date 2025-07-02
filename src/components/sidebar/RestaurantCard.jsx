const RestaurantCard = ({onClick, restaurant}) => {
    const handleClick = () =>{
        onClick(restaurant)
    }

    return (
        <div
        className= {`restaurant_card ${isSelected} ? 'Selected' : '' `}
        onClick = {handleClick}
        >
        <img 
        src= {restaurant.photoUrl}
        alt= {restaurant.name}
        className="restaurant-image"
         />
         <div className='restaurant_info'>
            <h3 className='restaurant-name'>{restaurant.name}</h3>

             <div className="restaurant-details">
                <span className="rating">⭐ {restaurant.rating}</span>
                <span className="cuisine">🍽️ {restaurant.cuisine}</span>
                <span className="distance">📍 {restaurant.distance} mi</span>

            <div className="restaurant-meta">
                <span className="price">{"$".repeat(restaurant.priceLevel)}</span>
                <span className={`status ${restaurant.isOpen ? 'Open' : 'Closed'}`}>
                     {restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                </span>
            </div>
        </div>
         </div>
        
        </div>
    )

}

export default RestaurantCard; 