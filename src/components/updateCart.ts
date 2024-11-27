 const updateCart = async (id:number, product:any[])=>{
    let response = await fetch('https://dummyjson.com/carts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 1,
            products: [
                {
                    id: 144,
                    quantity: 4,
                },
                {
                    id: 98,
                    quantity: 1,
                },
            ]
        })
    })
    response = await response.json()
    return response
}

export default updateCart;