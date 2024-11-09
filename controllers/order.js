const Order = require('../model/order');
const Cart = require('../model/cart');
const Product = require('../model/product');

// 1. Place Order
const placeOrder = async (req, res) => {
    const { customerId, shippingDetails } = req.body;

    try {
        // Find the cart for the customer
        const cart = await Cart.findOne({ customerId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).send("Cart is empty.");
        }

        // Calculate the total amount
        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            const product = item.productId;
            const price = product.price;
            totalAmount += price * item.quantity;
            return {
                productId: product._id,
                quantity: item.quantity,
                price
            };
        });

        // Create a new order
        const order = new Order({
            customerId,
            items: orderItems,
            totalAmount,
            shippingDetails,
            orderStatus: 'Pending'
        });

        // Save the order
        await order.save();

        // Optionally, clear the cart after the order is placed
        await Cart.deleteOne({ customerId });

        res.json({ message: "Order placed successfully.", orderId: order._id });
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).send("An error occurred while placing the order.");
    }
};

// 2. Get All Orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.productId').populate('customerId').sort({ orderDate: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).send("No orders found.");
        }

        res.json({ orders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).send("An error occurred while fetching orders.");
    }
};

// 3. Get Orders by Customer ID
const getOrdersByCustomer = async (req, res) => {
    const { customerId } = req.params;

    try {
        const orders = await Order.find({ customerId }).populate('items.productId').sort({ orderDate: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).send("No orders found for this customer.");
        }

        res.json({ orders });
    } catch (err) {
        console.error("Error fetching orders by customer:", err);
        res.status(500).send("An error occurred while fetching orders for this customer.");
    }
};

module.exports = { placeOrder, getAllOrders, getOrdersByCustomer };