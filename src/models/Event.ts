interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  imageFileId: number;
  imageFilePath: string;
  tickets: number;
  purchasedTickets: number;
}

export default Event;
