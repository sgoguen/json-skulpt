import { isSimpleType, shapeData, ShapedData, SimpleType } from "./data-shapes";


export function JsonViewer(props: { data: any; }) {
  const dataShape = shapeData(props.data);
  return formatShapedData(dataShape);
}
function formatShapedData(data: ShapedData | SimpleType) {
  if (isSimpleType(data)) {
    return <span className="null">Null</span>;
  }
  switch (data.shapeType) {
    case "simple":
      return <span>{data.value}</span>;
    case "simpleArray":
      return (<table>
        {data.array.map((item, index) => (<tr><td>{item?.toString() ?? <span className="null">null</span>}</td></tr>))}
      </table>
      );
    case "simpleObject":
      const simpleKeys = Object.keys(data.obj);
      const simpleObj = data.obj;
      return (<table className="nested-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {simpleKeys.map((key, index) => (<tr>
            <td>{key}</td>
            <td>{formatShapedData(shapeData(simpleObj[key]))}</td>
          </tr>))}
        </tbody>
      </table>);


    case "nestedObject":
      const keys = Object.keys(data.obj);
      const o = data.obj;
      return (<table className="nested-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key, index) => (<tr>
            <td>{key}</td>
            <td>{formatShapedData(shapeData(o[key]))}</td>
          </tr>))}
        </tbody>
      </table>);
    case "simpleTable":
      return (<table className="simple-table">
        <thead>
          <tr>
            {data.columns.map((column, index) => (<th>{column}</th>))}
          </tr>
        </thead>
        <tbody>
          {data.table.map((row, index) => (<tr>
            {data.columns.map((column, index) => (<td>{row[column]}</td>))}
          </tr>))}
        </tbody>
      </table>
      );
    case "nestedTable":
      const { table, columns } = data;
      return (<table className="nested-table">
        <thead>
          <tr>
            {columns.map((column, index) => (<th>{column}</th>))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, index) => (<tr>
            {columns.map((column, index) => (<td>{formatShapedData(shapeData(row[column]))}</td>))}
          </tr>))}
        </tbody>
      </table>);


    default:
      return <div>
        {/* <h1>Unshapened</h1> */}
        <pre>{JSON.stringify(data.value, null, 4)}</pre>
      </div>;
  }
}
