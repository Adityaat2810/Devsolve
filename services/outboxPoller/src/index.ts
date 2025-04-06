import { Queue } from "bullmq";
import { redis } from "./redisConnection";

export const databaseQueue = new Queue("data-processing", {
  connection:redis,
  defaultJobOptions:{
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  }
})

export async function addDataToQueue(data:any){
  await databaseQueue.add("process-data", data)
}

addDataToQueue("Hello World")
  .then(() => {
    console.log("Data added to queue successfully");
  })
  .catch((error) => {
    console.error("Error adding data to queue:", error);
});