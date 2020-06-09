/* istanbul ignore file */
import * as d3 from 'd3';
import 'd3-selection-multi';
import { v4 as uuidv4 } from 'uuid';

export const resetStyle = (d3, element) => {
  d3.selectAll(element)
    .style('fill', 'lightgray');
  return d3;
};

export const clearView = svg => svg.selectAll('*').remove();

export const ticked = (link, node, edgepaths, edgelabels) => {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node.attr('transform',
    d => `translate(${d.x}, ${d.y})`);

  edgepaths.attr('d', d => `M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`);

  edgelabels.attr('transform', function transform(d) {
    if (d.target.x < d.source.x) {
      const bbox = this.getBBox();

      const rx = bbox.x + bbox.width / 2;
      const ry = bbox.y + bbox.height / 2;
      return `rotate(180 ${rx} ${ry})`;
    }

    return 'rotate(0)';
  });
};

export const dragended = (d3, d, simulation) => {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
};

export const initDefinitions = svg => svg.append('defs')
  .append('marker')
  .attrs({
    id: 'arrowhead',
    viewBox: '-0 -5 10 10',
    refX: 34,
    refY: 0,
    orient: 'auto',
    markerWidth: 8,
    markerHeight: 8,
    xoverflow: 'visible',
  })
  .append('svg:path')
  .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
  .attr('fill', '#999')
  .style('stroke', 'none');

export const forceSimulation = (d3, { width, height }) => d3.forceSimulation()
  .force(
    'link',
    d3.forceLink()
      .id(d => d.id)
      .distance(200)
      .strength(2),
  )
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(width / 2, height / 2));

const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

export default function render(nodes) {
  const links = nodes.map(node => node.linkTo.map(nodeId => ({
    id: uuidv4(),
    source: node.id,
    target: nodeId,
  }))).reduce((result, current) => ([
    ...current,
    ...result,
  ]), []);
  clearView(svg); // removes everything!
  initDefinitions(svg);
  const simulation = forceSimulation(d3, { width, height });

  const link = svg.selectAll('.link')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('marker-end', 'url(#arrowhead)');

  const edgepaths = svg.selectAll('.edgepath')
    .data(links)
    .enter()
    .append('path')
    .attrs({
      class: 'edgepath',
      'fill-opacity': 0,
      'stroke-opacity': 0,
      id(d, i) { return `edgepath${i}`; },
    })
    .style('pointer-events', 'none');

  const edgelabels = svg.selectAll('.edgelabel')
    .data(links)
    .enter()
    .append('text')
    .style('pointer-events', 'none')
    .attrs({
      class: 'edgelabel',
      id(d, i) { return `edgelabel${i}`; },
      'font-size': 10,
      fill: '#aaa',
    });

  edgelabels.append('textPath')
    .attr('xlink:href', (d, i) => `#edgepath${i}`)
    .style('text-anchor', 'middle')
    .style('pointer-events', 'none')
    .attr('startOffset', '50%');

  const node = svg.selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', d => dragended(d3, d, simulation))
      .on('drag', d => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on('end', d => dragended(d3, d, simulation)));

  const circle = node.append('circle').attr('r', 40); // radius
  circle.attr('class', d => {
    if (d.active) {
      return 'active';
    }
    if (d.error) {
      return 'error';
    }
    return '';
  });
  svg.selectAll('circle')
    .on('click', () => { // arrow function will produce this = undefined
      d3.selectAll('circle')
        .style('fill', 'lightgray');
      d3.select(this)
        .style('fill', 'aliceblue');
    })
    .on('mouseover', () => {
      d3.selectAll('circle')
        .style('stroke', 'black');

      d3.select(this)
        .style('stroke', 'green');
    });

  const nodeText = node.append('text')
    .attr('dy', -3)
    .attr('y', -25);

  nodeText.selectAll('tspan.text')
    .data(d => d.name.split(' '))
    .enter()
    .append('tspan')
    .attr('class', 'text')
    .text(d => d)
    .attr('x', -10)
    .attr('dx', 10)
    .attr('dy', 22);

  node.append('title')
    .text(d => d.id);

  simulation
    .nodes(nodes)
    .on('tick', () => { ticked(link, node, edgepaths, edgelabels); });

  simulation.force('link')
    .links(links);
}
