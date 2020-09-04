<template>
<div :id="id" class="io-network">
  <div ref="network" class="network">
  </div>
</div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import * as d3 from 'd3'
import ionNodes from '~/data/ion/nodes'
import ionEdges from '~/data/ion/edges'

// based on https://observablehq.com/@d3/force-directed-graph

const drag = simulation => {
  function dragstarted(event) {
    if(!event.active) {
      simulation.alphaTarget(0.3).restart()
    }
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }
  function dragged(event) {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }
  function dragended(event) {
    if(!event.active) {
      simulation.alphaTarget(0)
    }
    event.subject.fx = null
    event.subject.fy = null
  }
  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

const makeGraph = svg => {
  const nodes = ionNodes.map(d => {
    return {
      id: d.id,
      name: d.fields.short_name,
      category: d.fields.category ? d.fields.category : 'default'
    }
  })
  const links = ionEdges.map(d => {
    return {
      source: d.fields.from[0],
      target: d.fields.to[0],
      value: 1 // placeholder
    }
  })

  const width = 600
  const height = 600
  const scale = d3.scaleOrdinal(d3.schemeCategory10)
  const color = d => scale(d.category)

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))

  svg.attr('viewBox', [0, 0, width, height])

  const link = svg.append('g')
    .attr('class', 'links')
    // .attr('stroke', '#999')
    // .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', d => Math.sqrt(d.value))

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('class', 'node')
    .call(drag(simulation))

  node.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 4)
    .attr('fill', color)

  node.append('text')
    .attr('x', 6)
    .attr('y', 3)
    .text(d => d.name)

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
    node
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
  })
}

export default {
  data() {
    return {
      id: 'uuid-' + uuidv4()
    }
  },
  mounted() {
    const svg = d3.select(this.$refs.network).append('svg')
    makeGraph(svg)
  }
}
</script>
<style lang="scss">
.io-network {
  > .network {
    font-size: 10px;
    .links {
      stroke: #888;
      stroke-opacity: 0.65;
    }
  }
}
</style>
