interface Type{ id: number; title: string; price: number; thumbnail: string; quantity: number }
const updateCart = async (id:number, product:Array<Type>)=>{
    const newProductCart = []
    for(let i = 0 ; i < product.length ; i++)
        {
            let newItem:{id:number, quantity:number} = {
                id: 0,
                quantity: 0
            }
            newItem["id"] = product[i]["id"];
            newItem["quantity"] = product[i]["quantity"]
            newProductCart.push(newItem)
        }

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

export default updateCart;