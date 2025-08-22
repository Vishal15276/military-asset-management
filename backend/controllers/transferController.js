import Transfer from "../models/Transfer.js";

// GET all transfers
export const getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find().sort({ createdAt: -1 });
    res.json({ success: true, transfers });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// POST new transfer
export const createTransfer = async (req, res) => {
  try {
    const transfer = new Transfer(req.body);
    await transfer.save();
    res.json({ success: true, transfer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
