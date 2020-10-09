<template>
<div :id="id" class="io-network">
  <div class="controls container">
    <div class="domains panel">
      <div v-for="d of domains" :key="d" class="domain" :class="!Number.isNaN(+d.substring(1)) ? 'code' : 'text'">
        <input v-model="showDomains" :value="d" type="checkbox"> <label>{{ d }}</label>
      </div>
    </div>
  </div>
  <div ref="network" class="network">
  </div>
  <div v-if="showDatum" class="datum-container">
    <div class="controls"></div>
    <template v-if="datumType === 'node'">
      <div class="category">{{ datum.category }}</div>
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
import domains from '~/data/ion/domains'
import allNodes from '~/data/ion/nodes'
import allLinks from '~/data/ion/edges'

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

const width = 1000
const height = 1000
const param = {
  node: {
    minR: 2,
    charge: -20
  },
  nodeLabel: {
    fontSize: 8,
    offsetX: 4,
    offsetY: 2
  },
  link: {
    minDist: 20,
    maxDist: 120,
    strokeWidth: 1
  }
}
const layout = {
  margin: 80,
  stepX: 32,
  stepY: 16,
  grid: {
    w: 5,
    h: 5
  }
}
const getAnchorAtGrid = (i, j) => {
  const xu = (width - layout.margin * 2) / layout.grid.w
  const yu = (height - layout.margin * 2) / layout.grid.h
  return {
    x: layout.margin + (i + 1) * xu - xu / 2,
    y: layout.margin + (j + 1) * yu - yu / 2
  }
}
layout.anchor = getAnchorAtGrid

const fixedLayoutGroups = []
const customNodes = [
  {
    name: '海峽論壇',
    highlyConnected: true
  },
  {
    name: '海峽青年節',
    highlyConnected: true
  }
]
fixedLayoutGroups.forEach(group => {
  if(group.bottom !== undefined) {
    group.array.reverse()
  }

  let px = 0
  let qx = 1
  let rx = 0
  if(group.left !== undefined) {
    rx = group.left
  } else if(group.right !== undefined) {
    px = width
    qx = -1
    rx = group.right
  } else if(group.center !== undefined) {
    px = (width - (Math.max(...group.array.map(row => row.length)) - 1) * layout.stepX) / 2
    qx = 1
    rx = group.center
  }
  const x0 = px + qx * layout.margin + qx * rx * layout.stepX

  let py = 0
  let qy = 1
  let ry = 0
  if(group.top !== undefined) {
    ry = group.top
  } else if(group.bottom !== undefined) {
    py = height
    qy = -1
    ry = group.bottom
  } else if(group.middle !== undefined) {
    py = (height - (group.array.length - 1) * layout.stepY) / 2
    qy = 1
    ry = group.middle
  }
  const y0 = py + qy * layout.margin + qy * ry * layout.stepY

  let x = x0
  let y = y0
  for(const row of group.array) {
    for(const nodeName of row) {
      if(nodeName) {
        customNodes.push({
          name: nodeName,
          x,
          y
        })
      }
      x += qx * layout.stepX
    }
    y += qy * layout.stepY
    x = x0
  }
})

const highlyConnectedNodes = customNodes.filter(node => node.highlyConnected === true).map(n => n.name)

const colorMap = new Map([
  ['none', 'gray'],
  ['中國', 'red'],
  ['香港', 'magenta'],
  ['台灣', 'green'],
  ['美國', 'blue'],
  ['論壇', 'orange']
])

const scale = d3.scaleOrdinal().domain(colorMap.keys()).range(colorMap.values())
const color = d => scale(d.group)
const nodeR = (node, i) => {
  return param.node.minR
}
const nodeCharge = (node, i) => {
  return param.node.charge
}
const linkDist = (link, i) => {
  let dist = param.link.minDist
  if(link.source && link.target && link.source.degree && link.target.degree) {
    dist = Math.max(Math.max(link.source.degree, link.target.degree) / 10 * param.link.minDist, param.link.minDist)
  }
  if(highlyConnectedNodes.includes(link.target.name)) {
    dist = param.link.maxDist
  }
  return dist
}
const linkStrength = (link) => {
  return 1 / Math.min(link.source.degree, link.target.degree) / 2
}

const GROUP = {
  TW: '台灣',
  HK: '香港',
  CN: '中國'
}

const linkLabelAlongLink = false

const forceStrength = 0.5
const customForces = [
  {
    name: 'cn-gov',
    ...layout.anchor(0, 0),
    r: 40,
    strength: forceStrength,
    color: scale(GROUP.CN),
    group: GROUP.CN,
    filter: d => ['中共', '政府'].some(s => d.category.includes(s))
  },
  {
    name: 'cn-ccp-media',
    ...layout.anchor(1, 0),
    r: 40,
    strength: forceStrength,
    color: scale(GROUP.CN),
    group: GROUP.CN,
    filter: d => ['官媒'].some(s => d.category.includes(s))
  },
  {
    name: 'tw-rlg-org',
    ...layout.anchor(2, 2),
    r: 10,
    strength: forceStrength,
    color: scale(GROUP.TW),
    group: GROUP.TW,
    filter: d => ['宗教'].some(s => d.category.includes(s))
  },
  {
    name: 'tw-cso',
    ...layout.anchor(3, 2),
    r: 60,
    strength: forceStrength,
    color: scale(GROUP.TW),
    group: GROUP.TW,
    filter: d => ['民間'].some(s => d.category.includes(s))
  },
  {
    name: 'tw-academia',
    ...layout.anchor(2, 3),
    r: 20,
    strength: forceStrength,
    color: scale(GROUP.TW),
    group: GROUP.TW,
    filter: d => ['學術'].some(s => d.category.includes(s))
  },
  {
    name: 'tw-media',
    ...layout.anchor(3, 3),
    r: 40,
    strength: forceStrength,
    color: scale(GROUP.TW),
    group: GROUP.TW,
    filter: d => ['主流媒體', '政論節目'].some(s => d.category.includes(s))
  },
  {
    name: 'tw-social-media',
    ...layout.anchor(4, 3),
    r: 80,
    strength: forceStrength,
    color: scale(GROUP.TW),
    group: GROUP.TW,
    filter: d => ['社交媒體', 'Fb'].some(s => d.category.includes(s))
  },
  {
    name: 'hk',
    ...layout.anchor(4, 2),
    r: 40,
    strength: forceStrength,
    color: scale(GROUP.HK),
    group: GROUP.HK
  }
]

function makeGraph(svg, vm) {
  svg
    .attr('viewBox', [0, 0, width, height])
    .attr('font-size', param.nodeLabel.fontSize)
    .on('click', vm.canvasClicked)

  // TODO: update links & nodes filtering responding to user input
  const links = allLinks.filter(link => link.domains.some(d => vm.showDomains.includes(d)))
  const linkedNodes = links.map(link => [link.source, link.target]).flat()
  const nodes = allNodes.filter(node => linkedNodes.includes(node.id))

  customNodes.forEach(customNode => {
    const node = nodes.find(d => d.name === customNode.name)
    if(node) {
      if(customNode.x && customNode.y) {
        node.customX = customNode.x
        node.customY = customNode.y
        node.fx = node.customX
        node.fy = node.customY
      }
    }
  })

  let simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(linkDist).strength(linkStrength))
    .force('charge', d3.forceManyBody().strength(nodeCharge))

  customForces.forEach(customForce => {
    const force = d3.forceRadial(customForce.r, customForce.x, customForce.y).strength(customForce.strength)
    const init = force.initialize
    force.initialize = nodes => {
      if(customForce.group !== undefined) {
        nodes = nodes.filter(d => d.group === customForce.group)
      }
      if(customForce.filter !== undefined) {
        nodes = nodes.filter(customForce.filter)
      }
      init(nodes)
    }
    simulation = simulation.force(`force-${customForce.name}`, force)
    const g = svg.append('g').attr('class', 'force')
    g.append('circle')
      .attr('cx', customForce.x)
      .attr('cy', customForce.y)
      .attr('r', 4)
      .attr('fill', 'none')
      .attr('stroke', customForce.color)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.35)
  })

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('class', 'link')
    .attr('stroke-width', d => param.link.strokeWidth)
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
    .attr('x', param.nodeLabel.offsetX)
    .attr('y', param.nodeLabel.offsetY)
    .text(d => d.name)

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
    linkLabel
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2 + param.nodeLabel.offsetY)
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
      showDatum: false,
      domains,
      showDomains: ['B3', 'B4', 'B5']
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
  > .controls {
    position: sticky;
    top: 0.5rem;
    left: 0;
    font-size: 0.875rem;
    > .panel {
      background-color: white;
      padding: 1rem;
      border-radius: 0.25rem;
      @include shadow;

      &.domains {
        display: flex;
        flex-wrap: wrap;
        > .domain {
          &.code {
            flex-basis: 3rem;
          }
          &.text {
            flex-basis: 6rem;
          }
        }
      }
    }
  }
  > .network {
    .nodes {
      > .node {
        cursor: pointer;
        > text {
          fill: #222;
        }
      }
    }
    .links {
      stroke: #aaa;
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

    > .category,
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
