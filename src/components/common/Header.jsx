import SearchBar from "./SearchBar";

const Header = () =>{

    return(
        <header className="bg-white px-6 py-4 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-bold text-red-500">
                🍔jointBuddy
            </div>

            <SearchBar/>

            <div className="flex items-center gap-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                    📍 Set Location
                </button>
            </div>
            </header>
    )
}

export default Header;