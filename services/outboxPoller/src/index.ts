import DbInterface from "./getData";

const dbInterface = new DbInterface()
const startOutboxPoller = async () => {
  while (true) {
    try {
      const result = await dbInterface.getUnprocessedOutboxEntries();

      const delay = result!!.processed > 0 ? 1000 : 5000;
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.error('Poller error:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

startOutboxPoller().catch(error => {
  console.error('Fatal error in outbox poller:', error);
  process.exit(1);
});