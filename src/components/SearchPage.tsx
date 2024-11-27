import React, { Component } from "react";
import { observer } from "mobx-react";
import ApiStore from "./ApiStore";
import {RouterContext} from 'mobx-state-router';
import fetchCategories from "../methods/fetchCategories";
import ProductView from "./ProductView";
import UserStore from "./UserStore";
interface SearchPageProps {
}

@observer
class SearchPage extends Component<SearchPageProps> {
    constructor(props:any) {
        super(props);
        this.handleUser = this.handleUser.bind(this);
    }
    apiStore = ApiStore;
    userStore = UserStore;
    searchQuery: string = "";
    selectedCategory: string = "";
    selectedUser:string="1";
    categories: { slug: string; name: string; url: string }[] = [];
    static contextType = RouterContext;
    // user related things
    handleUser(event:React.ChangeEvent<HTMLSelectElement>){
        let userIDNew = event.target.value
        this.apiStore.setParticularCart(event.target.value)
        console.log("cart is ",  this.apiStore.cart[Number(userIDNew)])
        this.selectedUser = userIDNew
        this.apiStore.setSelectedUser(userIDNew)
        console.log("new user is ", this.apiStore.selectedUser, userIDNew)
    }

    async componentDidMount() {
        await this.fetchProducts();
        await this.fetchCategories();
        this.userStore = UserStore
        await this.userStore.fetchUsers()
        await this.apiStore.setSelectedUser(this.selectedUser)
    }

    fetchCategories = async () => {
        try {
            const got = await fetchCategories();
            this.setCategories(got);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    setSearchQuery = (query: string) => {
        this.searchQuery = query;
        this.filterProductsByText(query);
    };

    setSelectedCategory = async(category: string) => {
        this.selectedCategory = category;
        await this.fetchProducts();
    };

    setCategories = (categories: { slug: string; name: string; url: string }[]) => {
        this.categories = categories;
    };

    fetchProducts = async () => {
        let url = "https://dummyjson.com/products?limit=0";
        if (this.selectedCategory) {
            url = `https://dummyjson.com/products/category/${this.selectedCategory}`;
        }
        await this.apiStore.fetchData(url);
    };

    filterProductsByText = (query: string) => {
        const filteredData = this.apiStore.data.filter((product) =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        console.log(filteredData)
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
        console.log("new render")
        const { searchQuery, selectedCategory, categories, selectedUser } = this;
        const totalItemsInCart : number = 0
        const c: any = this.context;
        return (
            <div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={this.handleSearchChange}
                    placeholder="Search for products"
                    style={{padding: "8px", width: "60%", marginBottom: "20px"}}
                />

                <select
                    value={selectedCategory}
                    onChange={this.handleCategoryChange}
                    style={{padding: "8px", width: "20%", marginBottom: "20px", marginLeft: "10px"}}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select value={selectedUser}
                        onChange={this.handleUser}
                >
                    {
                        this.userStore.users.map((user: any) => {
                            return (
                                <option key={user.id} value={user.id}>{user.firstName}</option>
                            )
                        })
                    }
                </select>
                <button onClick={() => {
                    c.goTo("cart")
                }} style={{padding: "8px", width: "15%", marginBottom: "20px", marginLeft: "10px"}}>

                </button>
                <div>
                    {this.apiStore.loading ? (
                        <div>Loading...</div>
                    ) : this.apiStore.error ? (
                        <div>Error: {this.apiStore.error.message}</div>
                    ) : (
                        this.apiStore.newData.map((product) => (
                            <ProductView product={product}/>
                        ))
                    )}
                </div>
            </div>
        );
    }

    render() {
        return this.renderSearchPage();
    }
}

export {SearchPage};
// fine