export type GraphQLContext = {
  req: Request;
  res: Response;
  currentUser?: any;
};
