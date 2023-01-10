export type EventData = {
  id?: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  isDeleted?: boolean;
};

export type CurrentEventData = {
  id?: string;
  title: string;
  description: string;
  date: string;
  end: string;
  classNames?: string[];
};
