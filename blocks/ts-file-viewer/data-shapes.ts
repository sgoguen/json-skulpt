/*

When visualizing a JSON file, we want to break it down to a set of basic shapes:

1. Simple types: string, number, boolean, date, null
2. Simple arrays: array of simple types
3. Simple objects: object with simple properties
4. Simple tables: An array of objects with the same or similar properties
5. Nested objects and tables
*/

export type SimpleType = string | number | boolean | null;
export type SimpleArray = SimpleType[];
export type SimpleObject = { [key: string]: SimpleType };
export type SimpleTable = SimpleObject[];
export type NestedObject = {
  [key: string]: SimpleType | SimpleArray | SimpleObject | SimpleTable;
};
export type NestedTable = NestedObject[];

export type DataShape =
  | SimpleType
  | SimpleArray
  | SimpleObject
  | SimpleTable
  | NestedObject
  | NestedTable;
export type DataShapeType =
  | "simpleType"
  | "simpleArray"
  | "simpleObject"
  | "simpleTable"
  | "nestedObject"
  | "nestedTable";

type ShapedSimple = {
    shapeType: "simple";
    data: SimpleType;
};

type ShapedSimpleArray = {
    shapeType: "simpleArray";
    data: SimpleArray;
};

type ShapedSimpleObject = {
    shapeType: "simpleObject";
    data: SimpleObject;
};

type ShapedSimpleTable = {
    shapeType: "simpleTable";
    columns: string[];
    data: SimpleTable;
};

type ShapedNestedObject = {
    shapeType: "nestedObject";
    data: NestedObject;
};

type ShapedNestedTable = {
    shapeType: "nestedTable";
    data: NestedTable;
};

type UnknownShape = {
    shapeType: "unknown";
    data: unknown;
};

export type ShapedData =
  | ShapedSimple
  | ShapedSimpleArray
  | ShapedSimpleObject
  | ShapedSimpleTable
  | ShapedNestedObject
  | ShapedNestedTable | UnknownShape;

export function shapeData(data: any): ShapedData {
  if (
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean" ||
    data === null
  ) {
    return { shapeType: "simple", data };
  } else if (Array.isArray(data)) {
    if (data.length === 0) {
      return { shapeType: "simpleArray", data };
    } else {
      if (isSimpleArray(data)) {
        return { shapeType: "simpleArray", data };
      } else if (isSimpleTable(data)) {
        const columns = getTableColumns(data);
        return { shapeType: "simpleTable", data, columns };
      } else {
        return { shapeType: "nestedTable", data };
      }
    }
  } else if (typeof data === "object") {
    if (isSimpleObject(data)) {
      return { shapeType: "simpleObject", data };
    } else {
      return { shapeType: "nestedObject", data };
    }
  }
  return { shapeType: "unknown", data };
}

export function isSimpleType(data: any): data is SimpleType {
    return (
        typeof data === "string" ||
        typeof data === "number" ||
        typeof data === "boolean" ||
        data === null
    );
}

// If all properties are simple types, then it's a simple object and we should tell TypeScript that data is a SimpleObject
function isSimpleObject(data: any): data is SimpleObject {
  return Object.keys(data).every(
    (key) =>
      typeof data[key] === "string" ||
      typeof data[key] === "number" ||
      typeof data[key] === "boolean" ||
      data[key] === null
  );
}
function isSimpleArray(data: any[]): data is SimpleArray {
  return data.every(
    (item) =>
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean" ||
      item === null
  );
}
function isSimpleTable(data: any[]): data is SimpleTable {
  return data.every((item) => isSimpleObject(item));
}
function getTableColumns(data: SimpleTable): string[] {
  const columns: string[] = [];
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    });
  });
  return columns;
}

