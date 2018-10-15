export type ObservableListener<Entity> = (change: ChangeEvent<Entity>) => void;

// Root class for an observable collection. An observable collection provides
// a pub-sub interface for clients to subscribe to changes events to the
// collection.
export class ObservableCollection<Entity> {
  private readonly _subscribers: Set<ObservableListener<Entity>>;
  private readonly _async: boolean;

  constructor({async = true}) {
    // List of subscriber function callbacks invoked when change occurs.
    this._subscribers = new Set();
    this._async = async;
  }

  // Subscribes to change events. Change event handlers are deduped, so 2 of the
  // same handlers will only trigger once.
  addListener(callback: ObservableListener<Entity>) {
    this._subscribers.add(callback);
  }

  removeListener(callback: ObservableListener<Entity>) {
    this._subscribers.delete(callback);
  }

  onChange(event: ChangeEvent<Entity>) {
    for (let subscriber of this._subscribers) {
      if (this._async) {
        setTimeout(subscriber.bind(window, event), 0);
      } else {
        subscriber(event);
      }
    }
  }
}

// Observable list implementation.
export class ObservableList<Entity> extends ObservableCollection<Entity> {
  private readonly _backingList: Entity[];

  constructor({async = true} = {}) {
    super({async: async});
    this._backingList = [];
  }

  add(item: Entity) {
    this._backingList.push(item);
    super.onChange(new ChangeEvent({added: [item]}));
  }

  get values() {
    return this._backingList.values();
  };
}

// Observable map implementation.
export class ObservableMap<Key, Entity> extends ObservableCollection<Entity> {
  private _backingMap: Map<Key, Entity>;

  constructor({async = true} = {}) {
    super({async: async});
    this._backingMap = new Map();
  }

  has(key: Key) {
    return this._backingMap.has(key);
  }

  get(key: Key) {
    return this._backingMap.get(key);
  }

  set(key: Key, value: Entity) {
    // If the key already exists, then the value is overwritten with the new
    // value and the old value is listed as a `removed` value in the change
    // event.
    const removed: Entity[] = [];
    if (this._backingMap.has(key)) removed.push(this._backingMap.get(key)!);

    this._backingMap.set(key, value);

    super.onChange(new ChangeEvent({added: [value], removed: removed}));
  }

  get keys() {
    return this._backingMap.keys();
  };

  get values() {
    return this._backingMap.values();
  };
}

export class ChangeEvent<Entity> {
  readonly added: Entity[];
  readonly removed: Entity[];

  constructor({added = [], removed = []}: { added?: Entity[], removed?: Entity[] } = {}) {
    this.added = added;
    this.removed = removed;
  }
}
