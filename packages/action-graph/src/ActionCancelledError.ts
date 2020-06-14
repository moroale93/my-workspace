export default class ActionCancelledError extends Error {
  constructor(actionId: string) {
    super(`Action ${actionId} cancelled`);
  }
}
