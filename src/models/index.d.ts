import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Note {
  readonly id: string;
  readonly title: string;
  readonly body?: string;
  readonly draft: boolean;
  constructor(init: ModelInit<Note>);
  static copyOf(source: Note, mutator: (draft: MutableModel<Note>) => MutableModel<Note> | void): Note;
}