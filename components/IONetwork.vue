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
const cnst = {
  node: {
    minR: 3
  },
  nodeLabel: {
    fontSize: 5,
    offsetX: 4,
    offsetY: 2
  },
  link: {
    minDist: 20,
    maxDist: 120,
    strokeWidth: 1
  }
}
const highlyConnectedNodes = [
  '海峽論壇',
  '海峽青年節'
]

const nodeCategories = [...new Set(nodes.map(d => d.category))]
nodeCategories.sort()
const colorMap = new Map(nodeCategories.map(cat => {
  let color = 'gray'
  if(['中國', '中共'].some(s => cat.includes(s))) {
    color = 'red'
  } else if(cat.includes('台灣')) {
    color = 'green'
  } else if(cat.includes('美國')) {
    color = 'blue'
  } else if(cat === '論壇') {
    color = 'orange'
  }
  return [cat, color]
}))

const scale = d3.scaleOrdinal().domain(colorMap.keys()).range(colorMap.values())
const color = d => scale(d.category)
const nodeR = (node, i) => {
  return cnst.node.minR
}
const nodeCharge = (node, i) => {
  return -6
}
const linkDist = (link, i) => {
  let dist = cnst.link.minDist
  if(link.source && link.target && link.source.degree && link.target.degree) {
    dist = Math.max(link.source.degree, link.target.degree) / 10 * 40
  }
  if(highlyConnectedNodes.includes(link.target.name)) {
    dist = cnst.link.maxDist
  }
  return dist
}

function makeGraph(svg, vm) {
  svg
    .attr('viewBox', [0, 0, width, height])
    .attr('font-size', cnst.nodeLabel.fontSize)
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
    .attr('stroke-width', d => cnst.link.strokeWidth)
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
    .attr('x', cnst.nodeLabel.offsetX)
    .attr('y', cnst.nodeLabel.offsetY)
    .text(d => d.name)

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
    linkLabel
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2 + cnst.nodeLabel.offsetY)
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
