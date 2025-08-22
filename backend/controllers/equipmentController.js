import Equipment from "../models/Equipment.js";

// ✅ Get all equipment
export const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json({ success: true, equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching equipment", error: error.message });
  }
};

// ✅ Create new equipment
export const createEquipment = async (req, res) => {
  try {
    const { name, category, quantity, base } = req.body;

    const newEquipment = new Equipment({
      name,
      category,
      quantity,
      base,
    });

    await newEquipment.save();
    res.status(201).json({ success: true, equipment: newEquipment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding equipment", error: error.message });
  }
};
