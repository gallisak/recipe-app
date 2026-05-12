export default function RecipesPage() {
    return (
        <div>
            <h1 className="text-2xl text-white font-bold mb-6">Recipes</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Тут будуть картки рецептів */}
                <div className="aspect-video bg-gray-100 rounded-xl animate-pulse" />
                <div className="aspect-video bg-gray-100 rounded-xl animate-pulse" />
                <div className="aspect-video bg-gray-100 rounded-xl animate-pulse" />
            </div>
        </div>
    );
}