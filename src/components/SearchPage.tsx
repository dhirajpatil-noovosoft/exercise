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
        await this.apiStore.setParticularCart(userIDNew)
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
        await this.fetchProducts()

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
        if(this.searchQuery && this.selectedCategory)
        {
            url = `https://dummyjson.com/products/search?q=${this.searchQuery}`
            await this.apiStore.fetchData(url);
            this.filterProductsByCategory(this.selectedCategory)
        }
        else if (this.selectedCategory) {
            url = `https://dummyjson.com/products/category/${this.selectedCategory}`;
            await this.apiStore.fetchData(url);
        }
        else if(this.searchQuery) {
            url = `https://dummyjson.com/products/search?q=${this.searchQuery}`
            await this.apiStore.fetchData(url);
        }
        else
            await this.apiStore.fetchData(url);
    };

    filterProductsByCategory = (query: string) => {
        const filteredData:any = this.apiStore.data.filter((product) =>
            (product.category === (query.toLowerCase()))
        );
        this.apiStore.setNewData(filteredData);
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
                <button className="cartButton" onClick={() => {
                    c.goTo("cart")
                }} >
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