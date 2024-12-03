interface Type
{ id: number; title: string; price: number; thumbnail: string; description:string; category:string; quantity:number }
class apiStore{
    fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/categories`);
            return await response.json();
        } catch (error) {
            return {
                "error" : error
            }
        }
    };
    GetCart = async (user: string) => {
        console.log("user", user)
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/carts/user/${user}`);
        const res = await response.json()
        return res.carts.length === 0 ? [] : res.carts[0].products
    };
    updateCart = async (id:number, product:Array<Type>)=>{
        const newProductCart = product.map((item: { id: number; quantity: number }) => ({
            id: item.id,
            quantity: item.quantity,
        }));

        let response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/carts/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: id,
                products: [
                    newProductCart
                ]
            })
        })
        response = await response.json()
        return response
    }
}
const ApiStore = new apiStore()
export default ApiStore