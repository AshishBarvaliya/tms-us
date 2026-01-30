export type GraphQLContext = {
  user: { id: string; role: "admin" | "employee" };
  role: "admin" | "employee";
};
