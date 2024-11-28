const GetCart = async (user:string)=>{
    let cart = await fetch(`https://dummyjson.com/carts/user/${user}`);
    let carts = await cart.json()
    return carts
}
export default GetCart;