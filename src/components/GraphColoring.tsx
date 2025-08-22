import React, { useState, useEffect } from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
  color: number;
}

interface Edge {
  from: string;
  to: string;
}

interface GraphColoringProps {
  onSolved: () => void;
  onError: () => void;
}

const GraphColoring: React.FC<GraphColoringProps> = ({ onSolved, onError }) => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'A', x: 100, y: 50, color: 0 },
    { id: 'B', x: 200, y: 50, color: 0 },
    { id: 'C', x: 150, y: 120, color: 0 },
    { id: 'D', x: 50, y: 120, color: 0 },
    { id: 'E', x: 250, y: 120, color: 0 },
    { id: 'F', x: 150, y: 190, color: 0 }
  ]);

  const edges: Edge[] = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'A', to: 'D' },
    { from: 'B', to: 'C' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'D' },
    { from: 'C', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'D', to: 'F' },
    { from: 'E', to: 'F' }
  ];

  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());

  const colors = [0, 1, 2, 3, 4, 5]; // 0 = no color, 1-5 = graph-color-1 to graph-color-5

  // Check for conflicts
  useEffect(() => {
    const newConflicts = new Set<string>();
    
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode && 
          fromNode.color !== 0 && toNode.color !== 0 && 
          fromNode.color === toNode.color) {
        newConflicts.add(edge.from);
        newConflicts.add(edge.to);
      }
    });

    setConflicts(newConflicts);

    // Check if solved
    const allColored = nodes.every(node => node.color !== 0);
    const noConflicts = newConflicts.size === 0;
    
    if (allColored && noConflicts) {
      onSolved();
    } else if (newConflicts.size > 0) {
      onError();
    }
  }, [nodes, onSolved, onError]);

  const handleNodeClick = (nodeId: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, color: selectedColor }
          : node
      )
    );
  };

  const getNodeClass = (node: Node) => {
    let className = 'graph-node';
    
    if (node.color !== 0) {
      className += ` graph-color-${node.color}`;
    } else {
      className += ' bg-gray-200';
    }
    
    if (conflicts.has(node.id)) {
      className += ' ring-4 ring-error animate-pulse';
    }
    
    return className;
  };

  const getColorPickerClass = (colorIndex: number) => {
    let className = 'w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-200';
    
    if (colorIndex === 0) {
      className += ' bg-gray-200 border-gray-400';
    } else {
      className += ` graph-color-${colorIndex} border-white shadow-lg`;
    }
    
    if (selectedColor === colorIndex) {
      className += ' ring-4 ring-primary scale-110';
    }
    
    return className;
  };

  return (
    <div className="game-card p-6">
      <h3 className="text-xl font-bold text-center mb-4 text-primary">
        Graph Coloring Challenge
      </h3>
      
      {/* Color Picker */}
      <div className="flex justify-center gap-3 mb-6">
        <div className="text-sm font-medium text-muted-foreground mb-2">
          اختر اللون:
        </div>
        <div className="flex gap-2">
          {colors.map(colorIndex => (
            <button
              key={colorIndex}
              onClick={() => setSelectedColor(colorIndex)}
              className={getColorPickerClass(colorIndex)}
              title={colorIndex === 0 ? 'مسح اللون' : `اللون ${colorIndex}`}
            />
          ))}
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="relative mx-auto" style={{ width: '300px', height: '240px' }}>
        <svg width="300" height="240" className="absolute inset-0">
          {/* Draw edges */}
          {edges.map((edge, index) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={index}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className="graph-edge"
              />
            );
          })}
        </svg>
        
        {/* Draw nodes */}
        {nodes.map(node => (
          <button
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            className={getNodeClass(node)}
            style={{
              position: 'absolute',
              left: node.x - 16,
              top: node.y - 16,
            }}
            title={`Node ${node.id}`}
          >
            <span className="text-xs font-bold text-white mix-blend-difference">
              {node.id}
            </span>
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>قم بتلوين العقد بحيث لا تحمل العقد المتصلة نفس اللون</p>
        {conflicts.size > 0 && (
          <p className="text-error mt-2 font-medium">
            ⚠️ يوجد تضارب في الألوان!
          </p>
        )}
      </div>
    </div>
  );
};

export default GraphColoring;