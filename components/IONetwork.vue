<template>
<div :id="id" class="io-network">
  <div ref="network" class="network">
  </div>
  <div v-if="showDatum" class="datum-container">
    <div class="controls"></div>
    <template v-if="datumType === 'node'">
      <div class="name">{{ datum.name }}</div>
    </template>
    <template v-if="datumType === 'link'">
      <div class="source">{{ datum.source.name }}</div>
      <div class="action">→ {{ datum.action }}</div>
      <div class="target">{{ datum.target.name }}</div>
    </template>
    <div v-if="datum.notes" class="notes">{{ datum.notes }}</div>
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
    event.subject.fx = event.subject.customX ? event.subject.customX : null
    event.subject.fy = event.subject.customY ? event.subject.customY : null
  }
  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

const width = 800
const height = 800
const cnst = {
  node: {
    minR: 3,
    charge: -6
  },
  nodeLabel: {
    fontSize: 5,
    offsetX: 4,
    offsetY: 2
  },
  link: {
    minDist: 24,
    maxDist: 96,
    strokeWidth: 1
  }
}
const customNodes = [
  {
    name: '海峽論壇',
    highlyConnected: true
  },
  {
    name: '海峽青年節',
    highlyConnected: true
  },
  {
    name: '中共中央',
    customX: width / 2,
    customY: 25
  },
  {
    name: '中華民國行政院',
    customX: width / 2,
    customY: height - 25
  }
]
const highlyConnectedNodes = customNodes.filter(node => node.highlyConnected === true).map(n => n.name)

const colorMap = new Map([
  ['none', 'gray'],
  ['中國', 'red'],
  ['台灣', 'green'],
  ['美國', 'blue'],
  ['論壇', 'orange']
])

const scale = d3.scaleOrdinal().domain(colorMap.keys()).range(colorMap.values())
const color = d => scale(d.group)
const nodeR = (node, i) => {
  return cnst.node.minR
}
const nodeCharge = (node, i) => {
  return cnst.node.charge
}
const linkDist = (link, i) => {
  let dist = cnst.link.minDist
  if(link.source && link.target && link.source.degree && link.target.degree) {
    dist = Math.max(Math.max(link.source.degree, link.target.degree) / 10 * cnst.link.minDist, cnst.link.minDist)
  }
  if(highlyConnectedNodes.includes(link.target.name)) {
    dist = cnst.link.maxDist
  }
  return dist
}

const linkLabelAlongLink = false

function makeGraph(svg, vm) {
  svg
    .attr('viewBox', [0, 0, width, height])
    .attr('font-size', cnst.nodeLabel.fontSize)
    .on('click', vm.canvasClicked)

  customNodes.forEach(customNode => {
    const node = nodes.find(d => d.name === customNode.name)
    if(customNode.customX && customNode.customY) {
      node.customX = customNode.customX
      node.customY = customNode.customY
      node.fx = node.customX
      node.fy = node.customY
    }
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
    if(linkLabelAlongLink) {
      linkLabel.attr('transform', d => {
        const a = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180 / Math.PI
        const x0 = (d.source.x + d.target.x) / 2
        const y0 = (d.source.y + d.target.y) / 2
        return `rotate(${a}, ${x0}, ${y0})`
      })
    }
    node
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
  })
}

export default {
  data() {
    return {
      id: 'uuid-' + uuidv4(),
      datum: null,
      datumType: null,
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
      this.datumType = 'node'
      this.showDatum = true
      event.stopPropagation()
    },
    linkClicked(event, d) {
      const datum = JSON.parse(JSON.stringify(d)) // d is nested with source & target nodes
      this.$set(this, 'datum', datum)
      this.datumType = 'link'
      this.showDatum = true
      event.stopPropagation()
    },
    canvasClicked(event, d) {
      this.datumType = null
      this.showDatum = false
    }
  }
}
</script>
<style lang="scss">
@import '~assets/styles/resources';

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
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20rem;
    min-height: 8rem;
    padding: 1rem;
    background-color: white;
    @include shadow;
    > .source,
    > .target {
      font-size: 0.875rem;
    }
    > .name,
    > .action {
      font-size: 1.25rem;
    }
    > .notes {
      margin-top: 0.5rem;
      font-size: 0.875rem;
    }
    > .datum {
      margin-top: 0.75rem;
      font-size: 0.625rem;
      font-family: "SF Mono", "Monaco", monospace;
    }
  }
}
</style>
