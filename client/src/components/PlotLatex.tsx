import React from 'react';
import Plot from 'react-plotly.js';
import Calc from '../functions/latex-equations'

const NUM_POINTS = 21;

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

        } catch(err) {
            xs.push(x);
            ys.push(0);
        } 

        if (!isNaN(y)) {
            xs.push(x);
            ys.push(y);
        } else {
            xs.push(x);
            ys.push(0);
        }
    } 
  
  
    return (
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
        layout={ {width: "20rem", height: "15rem", title: 'A Fancy Plot'} }
      />
    );
}

export default PlotLatex;