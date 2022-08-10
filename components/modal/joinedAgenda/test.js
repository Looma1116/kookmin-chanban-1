import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { List, AutoSizer } from "react-virtualized";

function Test() {
  const rowRenderer = ({ index, style }) => {
    const post = data[index];
    return <div style={style}>{post.content}</div>;
  };
  const dimmy = [
    {
      id: uuidv4(),
      content: "content 요",
    },
    {
      id: uuidv4(),
      content: "content 요",
    },
    {
      id: uuidv4(),
      content: "content 요",
    },
    {
      id: uuidv4(),
      content: "content 요",
    },
  ];
  const [data, setData] = useState(dimmy);
  const scrollListener = (params) => {
    if (params.scrollTop + params.clientHeight >= params.scrollHeight - 100) {
      if (data.length <= 100) {
        setData([
          ...data,
          {
            id: uuidv4(),
            content: "new content 요",
          },
          {
            id: uuidv4(),
            content: "content 요",
          },
          {
            id: uuidv4(),
            content: "content 요",
          },
          {
            id: uuidv4(),
            content: "content 요",
          },
        ]);
      }
    }
  };
  return (
    <AutoSizer AutoSizer>
      {({ width }) => (
        <List
          width={width}
          height={400}
          rowCount={data.length}
          rowHeight={200}
          rowRenderer={rowRenderer}
          onScroll={scrollListener}
          overscanRowCount={2}
        />
      )}
    </AutoSizer>
  );
}

export default Test;
