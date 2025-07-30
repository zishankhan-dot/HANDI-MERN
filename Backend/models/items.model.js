import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model("Item", itemSchema);

export default Item;

//adding items for this model 
export const addItem = async (itemData) => {
    try {
        const item = new Item(itemData);
        await item.save();
        return item;
    } catch (error) {
        throw new Error("Error adding item: " + error.message);
    }
};