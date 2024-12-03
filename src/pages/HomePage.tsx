import React, { Component } from "react";
import { observer} from "mobx-react";
import { makeObservable, observable, action } from "mobx";
import RootStore from "../stores/RootStore";
import {RouterContext} from "mobx-state-router";
import ProductView from "../components/ProductView";
import UserStore from "../stores/UserStore";
import ApiStore from "../stores/apiStore";
interface SearchPageProps {
    router?:any
}
@observer
class HomePage extends Component<SearchPageProps> {
    rootStore = RootStore;
    userStore = UserStore;
    apiStore = ApiStore
    searchQuery: string = ""; // Search input value
    selectedCategory: string = ""; // Selected category
    selectedUser: string = "1"; // Selected user ID
    categories: { slug: string; name: string; url: string }[] = []; // Categories array
    currentPage: number = 1; // Current page number
    itemsPerPage: number = 10; // Number of items per page
    static contextType = RouterContext;
    constructor(props:any) {
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
            itemsPerPage:observable,
            setItemsPerPage:action
        });
        this.setItemsPerPage = this.setItemsPerPage.bind(this)
        this.handleNumberOfItemsChange = this.handleNumberOfItemsChange.bind(this)
    }
    debounce(fn:any, delay:any){
        let timer:any;
        return function (...args:any){
            clearTimeout(timer)
            console.log("value", ...args[0].target.value)
            timer = setTimeout(()=> fn(...args), delay)
        }
    }
    async componentDidMount() {
        // Initialize data
        const c:any =this.context;
        this.selectedUser = c.routerState.params.id || "1"
        await this.rootStore.userStore.setSelectedUser(this.selectedUser);
        await this.rootStore.cartStore.setParticularCart(this.rootStore.userStore.selectedUser);
        await this.fetchProducts();
        await this.fetchCategories();
        this.userStore = UserStore;
        await this.userStore.fetchUsers();
        await this.rootStore.userStore.getUser();
    }

    // Fetch categories
    fetchCategories = async () => {
        try {
            const got = await this.apiStore.fetchCategories();
            this.setCategories(got);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };
    handleNumberOfItemsChange(event: React.ChangeEvent<HTMLInputElement>){
        this.setItemsPerPage(Number(event.target.value))
    }
    setItemsPerPage(quantity:number)
    {
        this.itemsPerPage = quantity
    }
    setCategories = (categories: { slug: string; name: string; url: string }[]) => {
        this.categories = categories;
    };

    // Update search query and fetch products
    setSearchQuery = async (query: string) => {
        this.searchQuery = query;
        this.currentPage = 1; // Reset to the first page on new search
        await this.fetchProducts("query");
    };

    // Update selected category and fetch products
    setSelectedCategory = async (category: string) => {
        this.selectedCategory = category;
        this.currentPage = 1; // Reset to the first page on new category
        await this.fetchProducts();
    };

    // Fetch products based on search and category
    fetchProducts = async (change?:string) => {
        const baseURL = process.env.REACT_APP_API_BASE_URL; // Fetch from .env
        let url = `${baseURL}/products?limit=0`; // Default URL

        if (this.searchQuery && this.selectedCategory) {
            if(change) {
                url = `${baseURL}/products/search?q=${this.searchQuery}`;
                await this.rootStore.dataStore.fetchData(url);
            }
            this.filterProductsByCategory(this.selectedCategory);
        } else if (this.selectedCategory) {
            url = `${baseURL}/products/category/${this.selectedCategory}`;
            await this.rootStore.dataStore.fetchData(url);
        } else if (this.searchQuery) {
            url = `${baseURL}/products/search?q=${this.searchQuery}`;
            await this.rootStore.dataStore.fetchData(url);
        } else {
            await this.rootStore.dataStore.fetchData(url);
        }
    };

    // Filter products by category
    filterProductsByCategory = (query: string) => {
        const filteredData: any = this.rootStore.dataStore.data.filter(
            (product) => product.category === query.toLowerCase()
        );
        this.rootStore.dataStore.setNewData(filteredData);
    };

    // Pagination actions
    nextPage = () => {
        const totalPages = Math.ceil(this.rootStore.dataStore.newData.length / this.itemsPerPage);
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
        let query = event.target.value;
        await this.setSearchQuery(query);
    };

    handleCategoryChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value;
        await this.setSelectedCategory(category);
    };

    handleUserChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const userIDNew = event.target.value;
        await this.rootStore.cartStore.setParticularCart(userIDNew);
        this.selectedUser = userIDNew;
        await this.rootStore.userStore.setSelectedUser(userIDNew);
        await this.rootStore.userStore.getUser();
    };

    getTotalItemsInCart = () => {
        const items = this.rootStore.cartStore.cartMap.get(this.rootStore.userStore.selectedUser) || [];
        if (!Array.isArray(items)) {
            console.warn("Cart items are not an array:", items);
            return 0; // Return 0 if items is not an array
        }
        return items.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    // Render page
    renderSearchPage() {
        const { selectedCategory, categories, currentPage, itemsPerPage } = this;
        const totalItemsInCart = this.getTotalItemsInCart();
        const c: any = this.context;

        // Pagination calculations
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = this.rootStore.dataStore.newData.slice(startIndex, endIndex);
        const totalPages = Math.ceil(this.rootStore.dataStore.newData.length / itemsPerPage);

        return (
            <div>
                <input
                    type="text"
                    onChange={this.debounce(this.handleSearchChange, 500)}
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
                <select onChange={this.handleUserChange}>
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
                    {this.rootStore.userStore.selectedUser}'s cart
                    <br />
                    {totalItemsInCart}
                </button>
                <div>
                    {this.rootStore.statusStore.loading ? (
                        <div>Loading...</div>
                    ) : this.rootStore.statusStore.error ? (
                        <div>Error: {this.rootStore.statusStore.error.message}</div>
                    ) : (
                        <>
                            {paginatedProducts.map((product) => (
                                <ProductView key={product.id} product={product} page={"home"} />
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
                                <input
                                    value={itemsPerPage}
                                    type="number"
                                    onChange={this.handleNumberOfItemsChange}
                                />
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

export { HomePage };
