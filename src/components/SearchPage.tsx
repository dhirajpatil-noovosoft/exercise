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
        this.handleUserChange = this.handleUserChange.bind(this);
    }

    apiStore = ApiStore;
    userStore = UserStore;
    searchQuery: string = "";
    selectedCategory: string = "";
    selectedUser:string="1";
    categories: { slug: string; name: string; url: string }[] = [];
    static contextType = RouterContext;
    // user related things
    async handleUserChange(event:React.ChangeEvent<HTMLSelectElement>){
        let userIDNew = event.target.value
        await this.apiStore.setParticularCart(event.target.value)
        this.selectedUser = userIDNew
        await this.apiStore.setSelectedUser(userIDNew)
        await this.apiStore.getUser()
    }
    getTotalItemsInCart = () => {
            let num : number = 0
            const items = this.apiStore.cartMap.get(this.apiStore.userid) || []
            for(let i = 0 ; i < items.length ; i++)
                num += items[i].quantity
            return num;
    }
    async componentDidMount() {
        await this.apiStore.setParticularCart(this.apiStore.selectedUser);
        await this.fetchProducts();
        await this.fetchCategories();
        this.userStore = UserStore
        await this.userStore.fetchUsers()
        await this.apiStore.setSelectedUser(this.selectedUser)
        await this.apiStore.getUser();
    }

    fetchCategories = async () => {
        try {
            const got = await fetchCategories();
            this.setCategories(got);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    setSearchQuery = async (query: string) => {
        this.searchQuery = query;
        if(this.selectedCategory)
            this.filterProductsByText(query);
        else await this.fetchProducts()

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
        else url = `https://dummyjson.com/products/search?q=${this.searchQuery}`
        await this.apiStore.fetchData(url);
    };

    filterProductsByText = (query: string) => {
        const filteredData:any = this.apiStore.data.filter((product) =>
                 (product.title.toLowerCase().includes(query.toLowerCase()) ||
                    product.description.toLowerCase().includes(query.toLowerCase()))
        );
        this.apiStore.setNewData(filteredData);
    };

    toggleCartPage =  () => {
        // this.showCart = !this.showCart; // Toggle the value between true and false
        // this.forceUpdate(); // Forcing a re-render to make sure the UI updates immediately
        // .goTo('/cart');  // deprecated as it cant be used in class based its a hook
    };

    handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await this.setSearchQuery(event.target.value);
    };

    handleCategoryChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        await this.setSelectedCategory(event.target.value);
    };

    renderSearchPage() {
        const { searchQuery, selectedCategory, categories } = this;
        const totalItemsInCart : number = this.getTotalItemsInCart()

        const c: any = this.context;
        return (
            <div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={this.handleSearchChange}
                    placeholder="Search for products"
                    style={{padding: "8px", width: "50%", marginBottom: "20px"}}
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
                <select value={this.apiStore.selectedUser}
                        onChange={this.handleUserChange}
                >
                    {
                        this.userStore.users.map((user: {id:string, firstName:string}) => {
                            return (
                                <option key={user.id} value={user.id}>{user.firstName}</option>
                            )
                        })
                    }
                </select>
                <button onClick={() => {
                    c.goTo("cart")
                }} style={{padding: "8px", width: "15%", marginBottom: "20px", marginLeft: "10px"}}>
                    {this.apiStore.userName}'s cart
                    <br/>
                    {totalItemsInCart}
                </button>
                <div>
                    {this.apiStore.loading ? (
                        <div>Loading...</div>
                    ) : this.apiStore.error ? (
                        <div>Error: {this.apiStore.error.message}</div>
                    ) : (
                        this.apiStore.newData.map((product) => (
                            <ProductView key={product.id} product={product}/>
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