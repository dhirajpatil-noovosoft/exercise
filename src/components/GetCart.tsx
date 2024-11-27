const GetCart = async (user:string)=>{
    let cart = await fetch(`https://dummyjson.com/carts/user/${user}`);
    let carts = await cart.json()
    let len = carts["carts"].length
    if(len === 0)
        return -1
    // to create new cart
    /*
    if(len===0){
        console.log("gere adding")
        let res = await fetch('https://dummyjson.com/carts/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId:user,
                products: [ { id: 144, quantity: 5, }, { id: 98, quantity: 1, }, ]
            })
        })
        carts = await res.json()
        return carts["id"]
    }
     */
    return carts["carts"][0]["id"];
}
export default GetCart;