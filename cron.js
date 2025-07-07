import cron from "node-cron";
import User from "./models/User.js";
import Transaction from "./models/Transaction.js";

// 💰 Plans list (same as frontend)
const plans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 100,
    profitPercent: 5,
    durationHrs: 24,
    description: "Earn 5% profit in 24 hours",
  },
  {
    id: "standard",
    name: "Standard Plan",
    price: 500,
    profitPercent: 10,
    durationHrs: 24,
    description: "Earn 10% profit in 24 hours",
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 1000,
    profitPercent: 15,
    durationHrs: 24,
    description: "Earn 15% profit in 24 hours",
  },
];

// 🔍 Fast lookup map: { basic: {...}, standard: {...}, ... }
const planMap = Object.fromEntries(plans.map(p => [p.id, p]));

// 🕒 Cron job runs every 1 minute
cron.schedule("0 * * * *", async () => {
  const now = new Date();

  try {
    const dueUsers = await User.find({
      nextPayout: { $lte: now },
      activePlan: { $ne: null }
    });

    for (const user of dueUsers) {
      const plan = planMap[user.activePlan];
      if (!plan) {
        console.warn(`⚠️ No plan found for user ${user.email}, planId = ${user.activePlan}`);
        continue;
      }

      // Calculate profit from plan
      const profit = (plan.price * plan.profitPercent) / 100;

      // Credit balance
      user.balance += profit;

      // End plan (or schedule next cycle if recurring)
      user.activePlan = null;
      user.planActivatedAt = null;
      user.planProfit = null;
      user.nextPayout = null;

      await user.save();

      const transactionId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      
      // Log transaction
      await Transaction.create({
        transactionId,
        userId: user._id,
        amount: profit,
        type: "profit",
        status: "completed",
      });

      console.log(`✓ Credited $${profit} to ${user.email} from ${plan.name}`);
    }
  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
});
