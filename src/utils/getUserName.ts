export const getUserName = async (): Promise<string> => {
    try {
        const response = await fetch('https://dummyjson.com/users/1');
        const data = await response.json();
        return `${data.firstName} ${data.lastName}`;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return 'Error fetching user data';
    }
};