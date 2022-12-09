
import { FileBlockProps, getLanguageFromFilename } from "@githubnext/blocks";
import { Button, Box } from "@primer/react";
import { JsonViewer } from "../json-file-skulpt/json-viewer";
import { isSimpleType, shapeData, ShapedData, SimpleType } from "./data-shapes";
import "./index.css";
import { getAST } from "./type-extractor";

export default function (props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata } = props;
  const language = Boolean(context.path)
    ? getLanguageFromFilename(context.path)
    : "N/A";

  const source = content;

  const tsJson = getAST(source);

  return (
    <Box p={4}>
      <Box
        borderColor="border.default"
        borderWidth={1}
        borderStyle="solid"
        borderRadius={6}
        overflow="hidden"
      >
        <Box
          bg="canvas.subtle"
          p={3}
          borderBottomWidth={1}
          borderBottomStyle="solid"
          borderColor="border.default"
        >
          File: {context.path} {language}
        </Box>
        <Box p={4}>
          {/* <pre className="language-typescript">{JSON.stringify(tsJson, null, 4)}</pre> */}
          <JsonViewer data={tsJson} />
        </Box>
      </Box>
    </Box>
  );
}

function formatShapedData(data: ShapedData | SimpleType) {
  if (isSimpleType(data)) {
    return <span className="null">Null</span>;
  }
  switch (data.shapeType) {
    case "simple":
      return <span>{data.data}</span>;
    case "simpleArray":
      return (<table>
        {data.data.map((item, index) => (<tr><td>{item?.toString() ?? <span className="null">null</span>}</td></tr>))}
      </table>
      );
    case "simpleTable":
      return (<table className="simple-table">
        <thead>
          <tr>
            {data.columns.map((column, index) => (<th>{column}</th>))}
          </tr>
        </thead>
        <tbody>
          {data.data.map((row, index) => (<tr>
            {data.columns.map((column, index) => (<td>{row[column]}</td>))}
          </tr>))}
        </tbody>
      </table>
      );
    case "nestedObject":
      const keys = Object.keys(data.data);
      const o = data.data;
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

    default:
      return <div>
        <h1>Unshapened</h1>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </div>;
  }
}