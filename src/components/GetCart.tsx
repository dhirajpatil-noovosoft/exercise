const GetCart = async (user: string) => {
    const response = await fetch(`https://dummyjson.com/carts/user/${user}`);
    return response.json();
};

export default GetCart;
