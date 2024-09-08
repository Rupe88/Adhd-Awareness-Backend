const cron = require("node-cron");
const sendMail = require("../services/sendEmail");
const Subscriber = require("../model/subscribeModel");

//rate limit
const EMAIL_LIMIT = 500;
const job = cron.schedule("0 0 * * *", async () => {
  try {
    const count = await Subscriber.countDocuments();
    if (count > EMAIL_LIMIT) {
      console.log("Email limit exceeded, pausing notifications");
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
},{
    scheduled:true,
    // timezone:"your time zone later"
});

module.exports=job
