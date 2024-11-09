const router = require('express').Router();
const { userSignup, userSignin } = require("../controllers/user.js");
const {productRegister , productUpdate ,deleteProduct , getAllProducts} = require("../controllers/product.js")
const { addToCart, updateCart, deleteFromCart, getCart } = require("../controllers/cart.js");
const { placeOrder, getAllOrders, getOrdersByCustomer } = require("../controllers/order");

// const authenticateToken = require("../middleware/auth.js");


//user related
router.post("/signup", userSignup);
router.post("/signin", userSignin);

//product related
router.post("/addproduct", productRegister);
router.patch("/updateproduct/:productId", productUpdate);
router.delete("/deleteproduct/:productId" , deleteProduct);
router.get("/products", getAllProducts);

//cart related 
router.post("/add", addToCart);  // Add product to cart
router.patch("/update", updateCart);  // Update product quantity in cart
router.delete("/delete", deleteFromCart);  // Delete product from cart
router.get("/", getCart);  // Get all products in cart


//order management 
router.post("/placeorder", placeOrder);
router.get("/getallorders", getAllOrders);
router.get("/orders/customer/:customerId", getOrdersByCustomer);

// Example of a protected route
// router.get("/protected-route", authenticateToken, (req, res) => {
//     res.send(`Hello, user with ID ${req.user.userId}`);
// });

module.exports = router;