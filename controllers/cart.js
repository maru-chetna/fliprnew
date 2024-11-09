const Cart = require('../model/cart');
const Product = require('../model/product');

// add to Cart
const addToCart = async (req, res) => {
    const { customerId, productId, quantity } = req.body;

    // Validate quantity
    if (quantity <= 0) {
        return res.status(400).send("Quantity must be a positive integer.");
    }

    try {
        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send("Product not found.");
        }

        // Find the cart for the customer
        let cart = await Cart.findOne({ customerId });

        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({ customerId, items: [] });
        }

        // Check if the product already exists in the cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId.toString());

        if (existingItem) {
            // Update the quantity if the product is already in the cart
            existingItem.quantity += quantity;
        } else {
            // Add new item to the cart
            cart.items.push({ productId, quantity });
        }

        // Save the cart
        await cart.save();

        res.json({ message: "Product added to cart.", cart });
    } catch (err) {
        console.error("Error adding product to cart:", err);
        res.status(500).send("An error occurred while adding the product to the cart.");
    }
};

// 2. Update Cart
const updateCart = async (req, res) => {
    const { customerId, productId, quantity } = req.body;

    if (quantity < 0) {
        return res.status(400).send("Quantity cannot be negative.");
    }

    try {
        const cart = await Cart.findOne({ customerId });

        if (!cart) {
            return res.status(404).send("Cart not found.");
        }

        const item = cart.items.find(item => item.productId.toString() === productId.toString());

        if (!item) {
            return res.status(404).send("Product not found in cart.");
        }

        if (quantity === 0) {
            // Remove product if quantity is 0
            cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        res.json({ message: "Cart updated successfully.", cart });
    } catch (err) {
        console.error("Error updating cart:", err);
        res.status(500).send("An error occurred while updating the cart.");
    }
};

// 3. Delete Product from Cart
const deleteFromCart = async (req, res) => {
    const { customerId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ customerId });

        if (!cart) {
            return res.status(404).send("Cart not found.");
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

        if (itemIndex === -1) {
            return res.status(404).send("Product not found in cart.");
        }

        // Remove product from cart
        cart.items.splice(itemIndex, 1);

        await cart.save();
        res.json({ message: "Product removed from cart.", cart });
    } catch (err) {
        console.error("Error deleting product from cart:", err);
        res.status(500).send("An error occurred while removing the product from the cart.");
    }
};


const getCart = async (req, res) => {
    const { customerId } = req.query;

    try {
        const cart = await Cart.findOne({ customerId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(404).send("No items found in the cart.");
        }

        // Calculate total amount
        let totalAmount = 0;
        cart.items.forEach(item => {
            totalAmount += item.quantity * item.productId.price;
        });

        res.json({ cart, totalAmount });
    } catch (err) {
        console.error("Error fetching cart:", err);
        res.status(500).send("An error occurred while retrieving the cart.");
    }
};

module.exports = { addToCart, updateCart, deleteFromCart, getCart };
