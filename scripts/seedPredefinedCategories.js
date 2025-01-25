import Category from "../models/categoryModel.js";

const predefinedCategories = [
  { name: "Work", type: "predefined" },
  { name: "Personal", type: "predefined" },
  { name: "Health", type: "predefined" },
  { name: "Education", type: "predefined" },
];

const seedPredefinedCategories = async () => {
  for (const category of predefinedCategories) {
    const exists = await Category.findOne({
      name: category.name,
      type: "predefined",
    });
    if (!exists) {
      await Category.create(category);
    }
  }
};

export default seedPredefinedCategories;
