import { DynamoDB } from 'aws-sdk';

export type DynamoClient<ItemT> = {
  put: ({ Item }: { Item: ItemT }) => Promise<ItemT>;
};

export function getDynamoClient<ItemT>(tableName: string) {
  const dynamo = new DynamoDB.DocumentClient();
  const methodInterceptor = function (target, property, receiver) {
    const targetValue = Reflect.get(target, property, receiver);
    if (typeof targetValue === 'function') {
      return function (...args: any[]) {
        return targetValue
          .apply(this, { TableName: tableName, ...args })
          .promise();
      };
    } else {
      return targetValue;
    }
  };

  return new Proxy(dynamo, { get: methodInterceptor }) as DynamoClient<ItemT>;
}
