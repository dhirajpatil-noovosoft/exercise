const fetchCategories = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/categories`);
        return await response.json();
    } catch (error) {
        return {
            "error" : error
        }
    }
};
export default fetchCategories;