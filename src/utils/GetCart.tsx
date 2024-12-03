const GetCart = async (user: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/carts/user/${user}`);
    const res = await response.json()
    return res.carts[0] || []
};

export default GetCart;
