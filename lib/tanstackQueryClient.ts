import { QueryClient } from "@tanstack/react-query";

export function makeClient() {
  const client = new QueryClient();

  return client;
}
