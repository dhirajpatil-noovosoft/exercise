import { makeObservable, observable, action } from "mobx";

class ApiStores {
    data: any[] = [];
    newData: any[] = [];
    loading: boolean = false;
    error: any = null;
    cart: { id: number; title: string; price: number; thumbnail: string; quantity: number }[] = [];

    constructor() {
        makeObservable(this, {
            data: observable,
            newData: observable,
            loading: observable,
            error: observable,
            cart: observable,
            setData: action,
            setNewData: action,
            setLoading: action,
            setError: action,
            addToCart: action,
            removeFromCart: action,
            updateCartQuantity: action,
            clearCart: action // New action to clear cart
        });
    }

    // Fetch data from the API
    async fetchData(url: string) {
        this.setLoading(true);
        try {
            const response = await fetch(url);
            const result = await response.json();
            this.setNewData(result.products || result); // Assuming 'products' is the key in the response
            this.setData(result.products || result);
        } catch (err) {
            this.setError(err);
        } finally {
            this.setLoading(false);
        }
    }

    // Set the data to the store
    setData(data: any[]) {
        this.data = data;
    }

    // Set the new filtered data
    setNewData(newData: any[]) {
        this.newData = newData;
    }

    // Set loading state
    setLoading(loading: boolean) {
        this.loading = loading;
    }

    // Set error state
    setError(error: any) {
        this.error = error;
    }

    // Add product to cart
    addToCart(product: { id: number; title: string; price: number; thumbnail: string }) {
        const existingProduct = this.cart.find((item) => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1; // Increment quantity if already in the cart
        } else {
            this.cart.push({ ...product, quantity: 1 }); // Add new product with quantity 1
        }
    }

    // Remove product from cart
    removeFromCart(productId: number) {
        this.cart = this.cart.filter((item) => item.id !== productId);
    }

    // Update product quantity in cart
    updateCartQuantity(productId: number, change: number) {
        const product = this.cart.find((item) => item.id === productId);
        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                this.removeFromCart(productId); // Remove product if quantity is 0
            }
        }
    }

    // Clear all items from the cart
    clearCart() {
        this.cart = [];
    }
}

const ApiStore = new ApiStores();
export default ApiStore;
// fine