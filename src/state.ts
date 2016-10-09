export type State = 'none' | 'pending' | 'fulfilled' | 'rejected'
export class States {
  static None: State = 'none';
  static Pending: State = 'pending';
  static Fulfilled: State = 'fulfilled';
  static Rejected: State = 'rejected';

  static forEach(fn: (state: State) => void): void {
    [States.None, States.Pending, States.Fulfilled, States.Rejected].forEach(fn);
  }
}
