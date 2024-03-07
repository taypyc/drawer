import React, { useState, useRef, useEffect } from "react";

interface Line {
  points: number[]; // array of x, y coordinates [x1, y1, x2, y2]
}

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 1200, height: 800 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      lines.forEach((line) => {
        drawLine(ctx, line.points);
      });
    }
  }, [lines, canvasSize]);

  const drawLine = (ctx: CanvasRenderingContext2D, points: number[]) => {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    ctx.lineTo(points[2], points[3]);
    ctx.stroke();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const points = [x, y, x + 100, y]; // example points, adjust as needed
    setLines([...lines, { points }]);
  };

  const handleCanvasSizeChange = (width: number, height: number) => {
    setCanvasSize({ width, height });
    // Adjust lines coordinates if needed
    setLines(lines.map((line) => {
      return {
        points: line.points.map((coord, index) => {
          return index % 2 === 0 ? coord * (width / canvasSize.width) : coord * (height / canvasSize.height);
        })
      }
    }));
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        style={{ border: "1px solid black" }}
      />
      <div>
        <button onClick={() => handleCanvasSizeChange(300, 200)}>Маленький</button>
        <button onClick={() => handleCanvasSizeChange(600, 400)}>Середній</button>
        <button onClick={() => handleCanvasSizeChange(900, 600)}>Великий</button>
      </div>
      <div>
        <h3>Список ліній:</h3>
        <ul>
          {lines.map((line, index) => (
            <li key={index}>points: {line.points.join(", ")}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CanvasComponent;
