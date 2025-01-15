import React, { useEffect, useRef, useState } from "react";
import { jsPlumb } from "jsplumb";
import html2canvas from "html2canvas";

const Flowchart = () => {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [draggedNode, setDraggedNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const instance = useRef(null);

  useEffect(() => {
    instance.current = jsPlumb.getInstance({
      Container: containerRef.current,
      DragOptions: { cursor: "pointer", zIndex: 2000 },
      Connector: ["Bezier"],
      Endpoint: ["Dot", { radius: 5 }],
      PaintStyle: { strokeWidth: 2, stroke: "#000" },
      HoverPaintStyle: { stroke: "#ff00ff" },
    });

    return () => {
      instance.current.reset();
    };
  }, []);

  useEffect(() => {
    nodes.forEach((node) => {
      instance.current.draggable(node.id, {
        cursor: "move",
        zIndex: 2000,
      });
    });
  }, [nodes]);

  const addNode = (type) => {
    const nodeId = `node-${Date.now()}`;
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: nodeId,
        type,
        position: { top: 100, left: 100 },
        width: 150,
        height: 75,
        text: "",
      },
    ]);
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("type", type);
    setDraggedNode(type);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = draggedNode;
    const nodeId = `node-${Date.now()}`;
    const newNode = {
      id: nodeId,
      type,
      position: {
        top: e.clientY - containerRef.current.offsetTop,
        left: e.clientX - containerRef.current.offsetLeft,
      },
      width: 150,
      height: 75,
      text: "",
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setDraggedNode(null);
  };

  const updateNodePosition = (id, top, left) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, position: { top, left } } : node
      )
    );
  };

  const updateNodeSize = (id, width, height) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, width, height } : node
      )
    );
  };

  const handleTextChange = (id, text) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === id ? { ...node, text } : node))
    );
  };

  const getNodeShape = (node) => {
    switch (node.type) {
      case "Rectangle":
        return (
          <rect x="0" y="0" width="100%" height="100%" rx="5" fill="#ccc" />
        );
      case "Circle":
        return <circle cx="50%" cy="50%" r="50%" fill="#aaa" />;
      case "Diamond":
        return (
          <polygon points="50%,0 100%,50% 50%,100% 0%,50%" fill="#ffcc00" />
        );
      case "Parallelogram":
        return (
          <polygon points="20%,0 80%,0 100%,100% 0%,100%" fill="#ff6666" />
        );
      default:
        return null;
    }
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

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar for drag-and-drop symbols */}
      <div
        style={{
          width: "200px",
          padding: "10px",
          borderRight: "1px solid #ccc",
          background: "#f4f4f4",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "Rectangle")}
          style={{ cursor: "move", marginBottom: "10px" }}
        >
          <img src="path_to_rectangle_image.svg" alt="Rectangle" width="50px" />
        </div>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "Circle")}
          style={{ cursor: "move", marginBottom: "10px" }}
        >
          <img src="path_to_circle_image.svg" alt="Circle" width="50px" />
        </div>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "Diamond")}
          style={{ cursor: "move", marginBottom: "10px" }}
        >
          <img src="path_to_diamond_image.svg" alt="Diamond" width="50px" />
        </div>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "Parallelogram")}
          style={{ cursor: "move", marginBottom: "10px" }}
        >
          <img
            src="path_to_parallelogram_image.svg"
            alt="Parallelogram"
            width="50px"
          />
        </div>
      </div>

      {/* Flowchart container */}
      <div
        ref={containerRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
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
              width: `${node.width}px`,
              height: `${node.height}px`,
              cursor: "pointer",
            }}
            onClick={() => setSelectedNodeId(node.id)}
          >
            <svg
              width={node.width}
              height={node.height}
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 ${node.width} ${node.height}`}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {getNodeShape(node)}
            </svg>
            {selectedNodeId === node.id && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: node.width,
                  height: node.height,
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                <textarea
                  value={node.text}
                  onChange={(e) => handleTextChange(node.id, e.target.value)}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    resize: "none",
                    outline: "none",
                    fontSize: "14px",
                    textAlign: "center",
                    verticalAlign: "middle",
                    padding: "5px",
                  }}
                />
              </div>
            )}
            {selectedNodeId === node.id && (
              <div
                style={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#000",
                  borderRadius: "50%",
                  cursor: "se-resize",
                }}
                onMouseDown={(e) => {
                  // Resizing logic goes here
                }}
              />
            )}
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
