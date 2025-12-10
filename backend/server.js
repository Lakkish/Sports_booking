const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");

const connectDB = require("./config/db");

dotenv.config();
connectDB(); // connect to MongoDB

const app = express();
app.use(errorHandler);
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/courts", require("./routes/courtRoutes"));
app.use("/api/equipment", require("./routes/equipmentRoutes"));
app.use("/api/coaches", require("./routes/coachRoutes"));
app.use("/api/pricing-rules", require("./routes/pricingRuleRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Default Route
app.get("/", (req, res) => {
  res.send("Sports Facility Booking API is running…");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
