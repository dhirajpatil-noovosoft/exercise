const fetchCategories = async () => {
    try {
        const response = await fetch("https://dummyjson.com/products/categories");
        const categories = await response.json();
        return categories;
    } catch (error) {
        return {
            "error" : error
        }
    }
};
export default fetchCategories;