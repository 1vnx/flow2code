import React, { useEffect, useRef, useState } from "react";
import { jsPlumb } from "jsplumb";
import html2canvas from "html2canvas";

const Flowchart = () => {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const instance = useRef(null);

  useEffect(() => {
    // Initialize jsPlumb instance
    instance.current = jsPlumb.getInstance({
      Container: containerRef.current,
      DragOptions: { cursor: "pointer", zIndex: 2000 }, // Ensure drag options are defined
    });

    // Cleanup function
    return () => {
      instance.current.reset(); // Reset jsPlumb instance on unmount
    };
  }, []);

  useEffect(() => {
    // After nodes are added, make them draggable
    nodes.forEach((node) => {
      instance.current.draggable(node.id, {
        // Drag options can be customized here
        cursor: "move", // Custom cursor style during drag
        zIndex: 2000, // Ensure the dragged element is on top
      });
    });
  }, [nodes]); // Re-run when nodes are added/updated

  const addNode = (type) => {
    const nodeId = `node-${Date.now()}`;
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: nodeId,
        type,
        position: { top: 100, left: 100 },
      },
    ]);
  };

  const exportToImage = () => {
    html2canvas(containerRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "flowchart.png";
      link.click();
    });
  };

  const updateNodePosition = (id, top, left) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, position: { top, left } } : node
      )
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          width: "200px",
          padding: "10px",
          borderRight: "1px solid #ccc",
          background: "#f4f4f4",
        }}
      >
        <button onClick={() => addNode("Rectangle")}>Add Rectangle</button>
        <button onClick={() => addNode("Circle")}>Add Circle</button>
      </div>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
        }}
      >
        {nodes.map((node) => (
          <div
            key={node.id}
            id={node.id}
            style={{
              position: "absolute",
              top: `${node.position.top}px`,
              left: `${node.position.left}px`,
              width: "100px",
              height: "50px",
              backgroundColor: node.type === "Rectangle" ? "#ccc" : "#aaa",
              borderRadius: node.type === "Circle" ? "50%" : "0",
              textAlign: "center",
              lineHeight: "50px",
            }}
            onDrag={(e) => e.preventDefault()}
            onDragEnd={(e) => {
              const { top, left } = e.target.getBoundingClientRect();
              updateNodePosition(
                node.id,
                top - containerRef.current.offsetTop,
                left - containerRef.current.offsetLeft
              );
            }}
          >
            {node.id}
          </div>
        ))}
      </div>

      <button
        onClick={exportToImage}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px",
        }}
      >
        Export to Image
      </button>
    </div>
  );
};

export default Flowchart;
