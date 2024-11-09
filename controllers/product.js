const Product = require("../model/product.js");


const productRegister = async(req,res)=>{
    try{
        const {name:namee, description:descriptione , price:pricee , category:categorye} = req.body;
        if(pricee>=0){
            let product = new Product({
                name:`${namee}`,
                description:`${descriptione}`,
                price:`${pricee}`,
                category:`${categorye}`,
            })
            product.save().then(()=>{
                console.log(product);
                res.send(`your product is registered with id :  ${product._id}`)
            })
        }else{
            res.send("price shoud be positive");
        }
    }catch(err){
        console.error("Error during registration:", error);
            res.status(500).send("An error occurred while product registering. Please try again later.");
    }
}


const productUpdate = async(req,res)=>{
    try {
        const { productId } = req.params;
        const { name, description, price, category } = req.body; 


        let updateFields = {};
        if (name) updateFields.name = name;
        if (description) updateFields.description = description;
        if (price !== undefined) {
            if (price < 0) {
                return res.status(400).send("Price should be positive.");
            }
            updateFields.price = price;
        }
        if (category) updateFields.category = category;


        const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });
        if (!updatedProduct) {
            return res.status(404).send("Product not found.");
        }

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("An error occurred while updating the product. Please try again later.");
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send("Product not found.");
        }
        console.log(product);

        await Product.findByIdAndDelete(productId).then(()=>{
            res.send("product deleted");
        });

        res.json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("An error occurred while deleting the product. Please try again later.");
    }
};


const getAllProducts = async (req, res) => {
    try {

        const products = await Product.find();

        if (products.length === 0) {
            return res.status(404).send("No products found.");
        }

        res.send({ products });
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).send("An error occurred while retrieving the products. Please try again later.");
    }
};



module.exports = {productRegister , productUpdate , deleteProduct , getAllProducts};