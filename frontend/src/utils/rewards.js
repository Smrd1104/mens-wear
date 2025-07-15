// utils/rewards.js
export const calculateRewardPoints = (orders) => {
    let totalPoints = 0;

    orders.forEach((order) => {
        if (order.status === 'Delivered') {
            order.items.forEach((item) => {
                const itemTotal = item.price * item.quantity;
                totalPoints += Math.floor(itemTotal / 1000); // 1 point per ₹10 spent
            });
        }
    });

    return totalPoints;
};
