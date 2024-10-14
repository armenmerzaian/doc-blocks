import EventEmitter from "eventemitter3";
//import types from eventemitter3
import { EventEmitter as EventEmitterType } from "eventemitter3";

const eventEmitter: EventEmitterType = new EventEmitter();
const Emitter = {
  on: (event: string, fn: (...args: any[]) => void) => eventEmitter.on(event, fn),
  once: (event: string, fn: (...args: any[]) => void) => eventEmitter.once(event, fn),
  off: (event: string, fn: (...args: any[]) => void) => eventEmitter.off(event, fn),
  emit: (event: string, payload: any) => eventEmitter.emit(event, payload),
};
Object.freeze(Emitter);
export default Emitter;
