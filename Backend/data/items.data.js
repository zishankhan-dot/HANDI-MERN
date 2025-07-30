// Initial items data for seeding the database
export const initialItems = [
    {
        name: "Chicken Handi",
        description: "Rich tomato-based masala with tender chicken",
        price: 12.99
    },
    {
        name: "Mutton Handi", 
        description: "Slow-cooked mutton in traditional spices",
        price: 14.99
    },
    {
        name: "Paneer Handi",
        description: "Soft paneer in creamy handi sauce", 
        price: 11.49
    },
    {
        name: "Mix Veg Handi",
        description: "Fresh veggies in mild yet flavorful curry",
        price: 10.99
    }
];

// Function to seed the database with initial items
export const seedItems = async () => {
    try {
        const { default: Item } = await import('../models/items.model.js');
        
        // Check if items already exist
        const existingItems = await Item.find();
        if (existingItems.length > 0) {
            console.log('Items already exist in database');
            return;
        }

        // Add initial items to the database .... insertmany will add multiple items at once 
        // rather than using a loop for each item and doing Item.save() 
        const items = await Item.insertMany(initialItems);
        console.log(`${items.length} items added to database`);
        return items;
    } catch (error) {
        console.error('Error seeding items:', error);
    }
};
