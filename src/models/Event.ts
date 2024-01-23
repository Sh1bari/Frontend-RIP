interface Event {
    id: number;
    name: string;
    description: string;
    date: string;
    imageFileId: number;
    imageFilePath: string;
    tickets: number;
    status: string;
    purchasedTickets: number;
  }
  
  export default Event;