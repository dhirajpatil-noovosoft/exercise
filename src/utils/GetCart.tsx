const GetCart = async (user: string) => {
    console.log("user", user)
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/carts/user/${user}`);
    const res = await response.json()
    return res.carts.length === 0 ? [] : res.carts[0].products
};

export default GetCart;
