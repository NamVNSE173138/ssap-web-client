export type ServiceType = {
    id: string;
    name: string;
    description: string;
    type: string;
    price: number;
    status: string;
    duration: Date;
    providerId: number;
    feedbacks: Array<FeedbackDto>;
    requestDetails: Array<RequestDetailsDto>;
  };

  export type FeedbackDto = {
    id?: number;
    content?: string;
    rating?: number;
    feedbackDate?: Date;
    applicantId?: number;
    serviceId?: number;
  };
  
  export type RequestDetailsDto = {
    id?: number;
    expectedCompletionTime?: Date;
    applicationNotes?: string;
    scholarshipType?: string;
    applicationFileUrl?: string;
    requestId?: number;
    serviceId?: number;
  };
  

  