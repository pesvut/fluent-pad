import React from 'react';
import Plot from 'react-plotly.js';
import Calc from '../functions/latex-equations'

const NUM_POINTS = 101;

function PlotLatex({data, onChange=()=>{}}) {
    const latex = data.text
    console.log(latex)
    const [minX, maxX] = [-5, 5]//[data.graph.minX, data.graph.maxX];
    
    const compute = new Calc(latex);

    const stepSize = (maxX - minX) / (NUM_POINTS-1);
    
    const xs:Number[] = []
    const ys:Number[] = []

    let y

    for (let x = minX; x <= maxX ; x+= stepSize) {
        try {
            y = compute.eval(x);

        } catch(err) {} 

        if (!isNaN(y)) {
            xs.push(x);
            ys.push(y);
        }
    } 
  
  
    return (
        <div className="graph-block">
        <h2 className="points-plotted">Points plotted: {xs.length}</h2>

      <Plot
        data={[
          {
            x: xs,
            y: ys,
            type: 'scatter',
            mode: 'lines+markers',
            line: {shape: 'spline'},
            marker: {color: 'purple'},
          },
        ]}
        layout={ {width: "20rem", height: "14rem", title: compute.latexToInfix(latex)} }
      />

        </div>
    );
}

export default PlotLatex;