export default class GqlError extends Error {
  result: any;

  constructor(result: { errors: any[] }) {
    super(`Gql Error: ${JSON.stringify(result.errors)}`);
    this.result = result;
  }
}
