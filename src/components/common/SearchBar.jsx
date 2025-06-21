import { useState } from "react";

const SearchBar = () => {
const[searchQuery,setSearchQuery] = useState('')

const handleSearch = (e)=> {
    e.preventDefault();
    console.log('Searching for ... ', searchQuery)
}
const handleKeyPress = (e)=> {
    if(e.key === 'Enter'){
        e.preventDefault()
        handleSearch(e)

    }
}


  return (
    <div className="flex-1 max-w-lg mx-8">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-red-500 focus:outline-none transition-colors"
            placeholder="Search restaurants, cuisines, or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </form>
    </div>
  )

}

export default SearchBar;