import React, { Component } from "react";
import { observer } from "mobx-react";
import ApiStore from "./ApiStore";
import {CartPage} from "./CartPage";
import { Navigate } from "react-router-dom";
import {RouterContext, useRouterStore} from 'mobx-state-router';
import {toJS} from "mobx";
interface SearchPageProps {
}

@observer
class SearchPage extends Component<SearchPageProps> {
    apiStore = ApiStore;
    searchQuery: string = "";
    selectedCategory: string = "";
    categories: { slug: string; name: string; url: string }[] = [];
    showCart: boolean = false; // Toggle between pages
    username: string = '';

    static contextType = RouterContext;

    constructor(props: SearchPageProps) {
        super(props);
    }

    componentDidMount() {
        this.fetchProducts();
        this.fetchCategories();
    }

    fetchCategories = async () => {
        try {
            const response = await fetch("https://dummyjson.com/products/categories");
            const categories = await response.json();
            this.setCategories(categories);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    setSearchQuery = (query: string) => {
        this.searchQuery = query;
        this.filterProductsByText(query);
    };

    setSelectedCategory = (category: string) => {
        this.selectedCategory = category;
        this.fetchProducts();
    };

    setCategories = (categories: { slug: string; name: string; url: string }[]) => {
        this.categories = categories;
    };

    fetchProducts = () => {
        let url = "https://dummyjson.com/products";
        if (this.selectedCategory) {
            url = `https://dummyjson.com/products/category/${this.selectedCategory}`;
        }
        this.apiStore.fetchData(url);
    };

    filterProductsByText = (query: string) => {
        const filteredData = this.apiStore.data.filter((product) =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        this.apiStore.setNewData(filteredData);
    };

    toggleCartPage =  () => {
        // this.showCart = !this.showCart; // Toggle the value between true and false
        // this.forceUpdate(); // Forcing a re-render to make sure the UI updates immediately
        // .goTo('/cart');  // deprecated as it cant be used in class based its a hook
    };

    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setSearchQuery(event.target.value);
    };

    handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setSelectedCategory(event.target.value);
    };

    renderSearchPage() {
        const { searchQuery, selectedCategory, categories } = this;
        const totalItemsInCart = this.apiStore.cart.reduce((acc, item) => acc + item.quantity, 0);
        const c: any = this.context;
        return (
            <div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={this.handleSearchChange}
                    placeholder="Search for products"
                    style={{padding: "8px", width: "300px", marginBottom: "20px"}}
                />

                <select
                    value={selectedCategory}
                    onChange={this.handleCategoryChange}
                    style={{padding: "8px", marginBottom: "20px", marginLeft: "10px"}}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button onClick={() => {
                    c.goTo("cart")
                }} style={{marginBottom: "20px"}}>
                    {this.username}'s cart : ({totalItemsInCart})
                </button>
                <div>
                    {this.apiStore.loading ? (
                        <div>Loading...</div>
                    ) : this.apiStore.error ? (
                        <div>Error: {this.apiStore.error.message}</div>
                    ) : (
                        this.apiStore.newData.map((product) => (
                            <div key={product.id} style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                                <div style={{ width: "20%" }}>
                                    <img src={product.thumbnail} alt={product.title} style={{ width: "100px" }} />
                                </div>
                                <div style={{ width: "60%" }}>
                                    <h3>{product.title}</h3>
                                    <p><strong>Description:</strong> {product.description}</p>
                                    <p><strong>Price:</strong> ${product.price}</p>
                                </div>
                                <div style={{ width: "20%", textAlign: "right" }}>
                                    {this.apiStore.cart.some(item => item.id === product.id) ? (
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <button onClick={() => this.apiStore.updateCartQuantity(product.id, -1)}>-</button>
                                            <span>{this.apiStore.cart.find(item => item.id === product.id)?.quantity}</span>
                                            <button onClick={() => this.apiStore.updateCartQuantity(product.id, 1)}>+</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => this.apiStore.addToCart(product)}>Add to Cart</button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    render() {
        return  this.renderSearchPage();
    }
}

export {SearchPage};
// fine