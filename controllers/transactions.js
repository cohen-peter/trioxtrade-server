  import Transaction from "../models/Transaction.js";

  // records a new transaction for the given user
  export const addTransaction = async (req, res) => {
    try {
      const {
        transactionId,
        userId,
        amount,
        type,
        status, 
      } = req.body;

      //create a new transaction for the user
      const newTransaction = new Transaction({
        transactionId,
        userId,
        amount,
        type,
        status,
      });

      const savedTransaction = await newTransaction.save();

      res.status(201).json(savedTransaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //gets all the transaction by the user
  export const getUserTransactions = async (req, res) => {
    try {
      const { userId } = req.params;
      const transactions = await Transaction.find({ userId });
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //gets the transaction by the type of transaction
  export const getTransactionByType = async (req, res) => {
    const { userId, type } = req.params;

    try {
      if (!type) {
        return res.status(400).json({ error: "Transaction type is required"})
      }

      const transactions = await Transaction.find({ userId, type });
      res.status(200).json(transactions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };