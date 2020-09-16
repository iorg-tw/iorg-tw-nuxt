<template>
<div :id="id" class="io-network">
  <div ref="network" class="network">
  </div>
  <div v-if="showDatum" class="datum-container">
    <div class="controls">
    </div>
    <div class="datum">{{ datum }}</div>
  </div>
</div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import * as d3 from 'd3'
import nodes from '~/data/ion/nodes'
import links from '~/data/ion/edges'

// based on https://observablehq.com/@d3/force-directed-graph
// d3 v6 migration guide https://observablehq.com/@d3/d3v6-migration-guide

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

const width = 800
const height = 600
const scale = d3.scaleOrdinal(d3.schemeCategory10)
const color = d => scale(d.category)

const nodeR = 4
const labelOffsetX = 6
const labelOffsetY = 3

const CONST = {
  link: {
    minDist: 20,
    maxDist: 80,
    strokeWidth: 2
  }
}

const highlyConnectedNodes = [
  '海峽論壇',
  '海峽青年節'
]

function nodeCharge(node, i) {
  return -8
}
function linkDist(link, i) {
  let dist = CONST.link.minDist
  if(link.source && link.target && link.source.degree && link.target.degree) {
    dist = Math.max(link.source.degree, link.target.degree) / 10 * 40
  }
  if(highlyConnectedNodes.includes(link.target.name)) {
    dist = CONST.link.maxDist
  }
  return dist
}

function makeGraph(svg, vm) {
  svg
    .attr('viewBox', [0, 0, width, height])
    .on('click', vm.canvasClicked)

  nodes.forEach(d => {
    d.degree = 0
  })

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(linkDist))
    .force('charge', d3.forceManyBody().strength(nodeCharge))
    .force('center', d3.forceCenter(width / 2, height / 2))

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', 'link')
    .attr('stroke-width', d => CONST.link.strokeWidth)
    .on('click', vm.linkClicked)

  const linkLabel = svg.append('g')
    .attr('class', 'link-labels')
    .selectAll('text')
    .data(links)
    .join('text')
    .text(d => d.action)
    .attr('class', 'link-label')
    .on('click', vm.linkClicked)

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('class', 'node')
    .on('click', vm.nodeClicked)
    .call(drag(simulation))

  node.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', nodeR)
    .attr('fill', color)

  node.append('text')
    .attr('x', labelOffsetX)
    .attr('y', labelOffsetY)
    .text(d => d.name)

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
    linkLabel
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2 + labelOffsetY)
    node
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
  })

  links.forEach(d => {
    d.source.degree += 1
    d.target.degree += 1
  })
}

export default {
  data() {
    return {
      id: 'uuid-' + uuidv4(),
      datum: null,
      showDatum: false
    }
  },
  mounted() {
    const svg = d3.select(this.$refs.network).append('svg')
    makeGraph(svg, this)
  },
  methods: {
    nodeClicked(event, d) {
      const datum = JSON.parse(JSON.stringify(d))
      this.$set(this, 'datum', datum)
      this.showDatum = true
      event.stopPropagation()
    },
    linkClicked(event, d) {
      const datum = JSON.parse(JSON.stringify(d)) // d is nested with source & target nodes
      this.$set(this, 'datum', datum)
      this.showDatum = true
      event.stopPropagation()
    },
    canvasClicked(event, d) {
      this.showDatum = false
    }
  }
}
</script>
<style lang="scss">
.io-network {
  position: relative;
  > .network {
    font-size: 6px;
    .nodes {
      > .node {
        cursor: pointer;
      }
    }
    .links {
      stroke: #888;
      stroke-opacity: 0.65;
      > .link {
        cursor: pointer;
      }
    }
    .link-labels {
      text-anchor: middle;
      > .link-label {
        fill: #aaa;
        cursor: pointer;
      }
    }
  }
  > .datum-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20rem;
    height: 12rem;
    padding: 1rem;
    background-color: white;
  }
}
</style>
