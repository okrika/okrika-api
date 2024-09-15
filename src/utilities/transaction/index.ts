import { ClientSession, Connection } from "mongoose";

export async function inTransaction<T>(
  connection: Connection,
  callback: (session: ClientSession) => Promise<T>
): Promise<T> {
  const session = await connection.startSession();

  let result: T;

  await session.withTransaction(async session => {
    result = await callback(session);
  });

  await session.endSession();

  return result;
}
