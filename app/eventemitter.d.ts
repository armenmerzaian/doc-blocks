declare module "reactjs-eventemitter" {
  interface EventEmitter {
    events: {
      [key: string]: Array<(data: any) => void>;
    };

    emit(event: string, data: any): void;
    dispatch(event: string, data: any): void;
    subscribe(event: string, callback: (data: any) => void): void;
  }

  const EventEmitter: EventEmitter;

  export default EventEmitter;
}
