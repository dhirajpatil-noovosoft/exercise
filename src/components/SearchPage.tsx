import React, { Component } from "react";
import { observer } from "mobx-react";
import { makeObservable, observable, action } from "mobx";
import RootStore from "../stores/RootStore";
import { RouterContext } from "mobx-state-router";
import fetchCategories from "../utils/fetchCategories";
import ProductView from "./ProductView";
import UserStore from "../stores/UserStore";

interface SearchPageProps {}

@observer
class SearchPage extends Component<SearchPageProps> {
    rootStore = RootStore;
    userStore = UserStore;

    searchQuery: string = ""; // Search input value
    selectedCategory: string = ""; // Selected category
    selectedUser: string = "1"; // Selected user ID
    categories: { slug: string; name: string; url: string }[] = []; // Categories array

    currentPage: number = 1; // Current page number
    itemsPerPage: number = 10; // Number of items per page
    static contextType = RouterContext;

    constructor(props: any) {
        super(props);

        // Making state observable
        makeObservable(this, {
            searchQuery: observable,
            selectedCategory: observable,
            currentPage: observable,
            setSearchQuery: action,
            setSelectedCategory: action,
            nextPage: action,
            prevPage: action,
        });
    }

    async componentDidMount() {
        // Initialize data
        await this.rootStore.setParticularCart(this.rootStore.selectedUser);
        await this.fetchProducts();
        await this.fetchCategories();
        this.userStore = UserStore;
        await this.userStore.fetchUsers();
        await this.rootStore.setSelectedUser(this.selectedUser);
        await this.rootStore.getUser();
    }

    // Fetch categories
    fetchCategories = async () => {
        try {
            const got = await fetchCategories();
            this.setCategories(got);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    setCategories = (categories: { slug: string; name: string; url: string }[]) => {
        this.categories = categories;
    };

    // Update search query and fetch products
    setSearchQuery = async (query: string) => {
        this.searchQuery = query;
        this.currentPage = 1; // Reset to the first page on new search
        await this.fetchProducts();
    };

    // Update selected category and fetch products
    setSelectedCategory = async (category: string) => {
        this.selectedCategory = category;
        this.currentPage = 1; // Reset to the first page on new category
        await this.fetchProducts();
    };

    // Fetch products based on search and category
    fetchProducts = async () => {
        const baseURL = process.env.REACT_APP_API_BASE_URL; // Fetch from .env
        let url = `${baseURL}/products?limit=0`; // Default URL

        if (this.searchQuery && this.selectedCategory) {
            url = `${baseURL}/products/search?q=${this.searchQuery}`;
            await this.rootStore.fetchData(url);
            this.filterProductsByCategory(this.selectedCategory);
        } else if (this.selectedCategory) {
            url = `${baseURL}/products/category/${this.selectedCategory}`;
            await this.rootStore.fetchData(url);
        } else if (this.searchQuery) {
            url = `${baseURL}/products/search?q=${this.searchQuery}`;
            await this.rootStore.fetchData(url);
        } else {
            await this.rootStore.fetchData(url);
        }
    };

    // Filter products by category
    filterProductsByCategory = (query: string) => {
        const filteredData: any = this.rootStore.data.filter(
            (product) => product.category === query.toLowerCase()
        );
        this.rootStore.setNewData(filteredData);
    };

    // Pagination actions
    nextPage = () => {
        const totalPages = Math.ceil(this.rootStore.newData.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage += 1;
        }
    };

    prevPage = () => {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
        }
    };

    // Event handlers
    handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        await this.setSearchQuery(query);
    };

    handleCategoryChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value;
        await this.setSelectedCategory(category);
    };

    handleUserChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const userIDNew = event.target.value;
        await this.rootStore.setParticularCart(userIDNew);
        this.selectedUser = userIDNew;
        await this.rootStore.setSelectedUser(userIDNew);
        await this.rootStore.getUser();
    };

    getTotalItemsInCart = () => {
        const items = this.rootStore.cartMap.get(this.rootStore.userid) || [];
        if (!Array.isArray(items)) {
            console.warn("Cart items are not an array:", items);
            return 0; // Return 0 if items is not an array
        }
        return items.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    // Render page
    renderSearchPage() {
        const { searchQuery, selectedCategory, categories, currentPage, itemsPerPage } = this;
        const totalItemsInCart = this.getTotalItemsInCart();

        const c: any = this.context;

        // Pagination calculations
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = this.rootStore.newData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(this.rootStore.newData.length / itemsPerPage);

        return (
            <div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={this.handleSearchChange}
                    placeholder="Search for products"
                    style={{ padding: "8px", width: "50%", marginBottom: "20px" }}
                />

                <select
                    value={selectedCategory}
                    onChange={this.handleCategoryChange}
                    style={{ padding: "8px", width: "20%", marginBottom: "20px", marginLeft: "10px" }}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select value={this.rootStore.selectedUser} onChange={this.handleUserChange}>
                    {this.userStore.users.map((user: { id: string; firstName: string }) => (
                        <option key={user.id} value={user.id}>
                            {user.firstName}
                        </option>
                    ))}
                </select>
                <button
                    className="cartButton"
                    onClick={() => {
                        c.goTo("cart");
                    }}
                >
                    {this.rootStore.userName}'s cart
                    <br />
                    {totalItemsInCart}
                </button>
                <div>
                    {this.rootStore.loading ? (
                        <div>Loading...</div>
                    ) : this.rootStore.error ? (
                        <div>Error: {this.rootStore.error.message}</div>
                    ) : (
                        <>
                            {paginatedProducts.map((product) => (
                                <ProductView key={product.id} product={product} />
                            ))}
                            <div>
                                {/* Pagination Controls */}
                                <button onClick={this.prevPage} disabled={currentPage === 1}>
                                    Prev
                                </button>
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={this.nextPage}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    render() {
        return this.renderSearchPage();
    }
}

export { SearchPage };
