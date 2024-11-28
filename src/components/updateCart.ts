 const updateCart = async (id:number, product:Array<{ id: number; title: string; price: number; thumbnail: string; quantity: number }>)=>{
    const newProductCart = []
    for(let i = 0 ; i < product.length ; i++)
        {
            const item = product[i]
            let newItem:any = {}
            newItem["id"] = item["id"];
            newItem["quantity"] = item["quantity"]
            newProductCart.push(newItem)
        }

    let response = await fetch('https://dummyjson.com/carts/add', {
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