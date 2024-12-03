interface Type{ id: number; title: string; price: number; thumbnail: string; quantity: number }
const updateCart = async (id:number, product:Array<Type>)=>{
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

export default updateCart;