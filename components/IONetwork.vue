<template>
<div :id="id" class="io-network">
  <div class="controls container">
    <div v-if="!isEditMode" class="panel">
      <button v-for="l of allLayouts" :key="l.id" class="layout" @click="activeLayoutID = l.id" :disabled="activeLayoutID === l.id">{{ l.name }}</button>
    </div>
    <div v-if="isEditMode" class="domains-multiselect panel">
      <label v-for="(d, domainID) in allDomains" :key="domainID" class="domain" :class="!Number.isNaN(+d.substring(1)) ? 'code' : 'text'">
        <input v-model="layoutEditor.domains" :value="domainID" type="checkbox"> <span>{{ d }}</span>
      </label>
    </div>
    <div v-if="isEditMode" class="panel">
      <textarea v-model="userString" class="layout-editor"></textarea>
      <button @click="doExport">EXP</button>
      <button @click="doImport">IMP</button>
    </div>
    <div class="panel">
      <button @click="toggleEditMode">{{ isEditMode ? '←' : '→' }}</button>
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
import allDomains from '~/data/ion/domains'
import allNodes from '~/data/ion/nodes'
import allLinks from '~/data/ion/edges'
import allLayouts from '~/data/ion/layouts'
import { textMap } from '~/lib/const'

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
    // fix after drag ended
  }
  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

const width = 960
const height = 720
const param = {
  anchor: {
    strength: 0.8,
    label: {
      fontSize: 8,
      offsetY: 3
    }
  },
  node: {
    minR: 2,
    charge: -50
  },
  nodeLabel: {
    fontSize: 8,
    offsetX: 4,
    offsetY: 2
  },
  link: {
    minDist: 16,
    maxDist: 120,
    distCoef: 0.05,
    strengthCoef: 0.2,
    strokeWidth: 1
  },
  layout: {
    margin: 100
  }
}
const getAnchorByPercentage = (p, q) => ({
  x: p / 100 * (width - 2 * param.layout.margin) + param.layout.margin,
  y: q / 100 * (height - 2 * param.layout.margin) + param.layout.margin
})

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

const highlyConnectedNodes = customNodes.filter(node => node.highlyConnected === true).map(n => n.name)

const colorMap = new Map([
  [textMap.nond, 'gray'],
  [textMap.china, 'red'],
  [textMap.hk, 'magenta'],
  [textMap.tw, 'green'],
  [textMap.usa, 'blue'],
  [textMap.forum, 'orange']
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
    dist = Math.max(Math.max(link.source.degree, link.target.degree) * param.link.distCoef * param.link.minDist, param.link.minDist)
  }
  if(highlyConnectedNodes.includes(link.target.name)) {
    dist = param.link.maxDist
  }
  return dist
}
const linkStrength = (link) => {
  return 1 / Math.min(link.source.degree, link.target.degree) * param.link.strengthCoef
}

const linkLabelAlongLink = true

const customForces = [
  {
    id: 'cn-gov',
    name: '中共、政府',
    ...getAnchorByPercentage(0, 0),
    r: 48,
    strength: param.anchor.strength,
    color: scale(textMap.china),
    group: textMap.china,
    filter: d => ['中共', '政府'].some(s => d.category.includes(s))
  },
  {
    id: 'cn-ccp-media',
    name: '官媒',
    ...getAnchorByPercentage(100, 0),
    r: 48,
    strength: param.anchor.strength,
    color: scale(textMap.china),
    group: textMap.china,
    filter: d => ['官媒'].some(s => d.category.includes(s))
  },
  {
    id: 'cn-media',
    name: '媒體',
    ...getAnchorByPercentage(100, 12),
    r: 32,
    strength: param.anchor.strength,
    color: scale(textMap.china),
    group: textMap.china,
    filter: d => ['媒體'].some(s => d.category.includes(s))
  },
  {
    id: 'cn-rlg-org',
    name: '宗教',
    ...getAnchorByPercentage(12, 0),
    r: 28,
    strength: param.anchor.strength,
    color: scale(textMap.china),
    group: textMap.china,
    filter: d => ['宗教'].some(s => d.category.includes(s))
  },
  {
    id: 'cn-ac',
    name: '學術',
    ...getAnchorByPercentage(25, 0),
    r: 28,
    strength: param.anchor.strength,
    color: scale(textMap.china),
    group: textMap.china,
    filter: d => ['學術'].some(s => d.category.includes(s))
  },
  {
    id: 'cn-poli',
    name: '政黨',
    ...getAnchorByPercentage(35, 0),
    r: 28,
    strength: param.anchor.strength,
    color: scale(textMap.china),
    group: textMap.china,
    filter: d => ['政黨'].some(s => d.category.includes(s))
  },
  {
    id: 'tw-gov',
    name: '政府',
    ...getAnchorByPercentage(0, 100),
    r: 28,
    strength: param.anchor.strength,
    color: scale(textMap.tw),
    group: textMap.tw,
    filter: d => ['政府'].some(s => d.category.includes(s))
  },
  {
    id: 'cn-cso',
    name: '民間',
    ...getAnchorByPercentage(50, 0),
    r: 68,
    strength: param.anchor.strength,
    color: scale(textMap.china),
    group: textMap.china,
    filter: d => ['民間', '企業'].some(s => d.category.includes(s))
  },
  {
    id: 'tw-rlg-org',
    name: '宗教',
    ...getAnchorByPercentage(10, 100),
    r: 28,
    strength: param.anchor.strength,
    color: scale(textMap.tw),
    group: textMap.tw,
    filter: d => ['宗教'].some(s => d.category.includes(s))
  },
  {
    id: 'tw-ac',
    name: '學術',
    ...getAnchorByPercentage(25, 100),
    r: 28,
    strength: param.anchor.strength,
    color: scale(textMap.tw),
    group: textMap.tw,
    filter: d => ['學術'].some(s => d.category.includes(s))
  },
  {
    id: 'tw-poli',
    name: '政黨',
    ...getAnchorByPercentage(35, 100),
    r: 28,
    strength: param.anchor.strength,
    color: scale(textMap.tw),
    group: textMap.tw,
    filter: d => ['政黨'].some(s => d.category.includes(s))
  },
  {
    id: 'tw-cso',
    name: '民間',
    ...getAnchorByPercentage(50, 100),
    r: 68,
    strength: param.anchor.strength,
    color: scale(textMap.tw),
    group: textMap.tw,
    filter: d => ['民間', '企業'].some(s => d.category.includes(s))
  },
  {
    id: 'tw-media',
    name: '主流媒體',
    ...getAnchorByPercentage(80, 100),
    r: 40,
    strength: param.anchor.strength,
    color: scale(textMap.tw),
    group: textMap.tw,
    filter: d => ['主流媒體', '政論節目'].some(s => d.category.includes(s))
  },
  {
    id: 'tw-social-media',
    name: '社交媒體',
    ...getAnchorByPercentage(100, 100),
    r: 80,
    strength: param.anchor.strength,
    color: scale(textMap.tw),
    group: textMap.tw,
    filter: d => ['社交媒體', 'Fb'].some(s => d.category.includes(s))
  },
  {
    id: 'usa',
    name: '美國',
    ...getAnchorByPercentage(100, 50),
    r: 40,
    strength: param.anchor.strength,
    color: scale(textMap.usa),
    group: textMap.usa
  },
  {
    id: 'hk',
    name: '香港',
    ...getAnchorByPercentage(0, 50),
    r: 40,
    strength: param.anchor.strength,
    color: scale(textMap.hk),
    group: textMap.hk
  }
]

let links = []
let nodes = []

function draw(vm) {
  console.info('draw')
  if(vm.isLocked) {
    return
  }
  vm.isLocked = true
  vm.svg
    .attr('viewBox', [0, 0, width, height])
    .attr('font-size', param.nodeLabel.fontSize)
    .on('click', vm.canvasClicked)

  links = allLinks.filter(link => link.domains.some(d => vm.layoutEditor.domains.includes(d))).map(link => Object.assign({}, link))
  const linkedNodes = links.map(link => [link.source, link.target]).flat()
  nodes = allNodes.filter(node => linkedNodes.includes(node.id)).map(node => Object.assign({}, node, {
    fx: null,
    fy: null
  }))

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

  if(Array.isArray(vm.layoutEditor.n)) {
    vm.layoutEditor.n.filter(n => n !== null && typeof n === 'object').forEach(d => {
      const targetNode = nodes.find(n => n.id === d.id)
      if(targetNode) {
        if(Number.isFinite(d.fx)) {
          targetNode.fx = d.fx
        }
        if(Number.isFinite(d.fy)) {
          targetNode.fy = d.fy
        }
      }
    })
  }

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
    simulation = simulation.force(`force-${customForce.id}`, force)
  })

  // force
  const force = vm.svg.selectAll('g.force')
    .data(customForces, d => d.id)
    .join(
      enter => {
        const gs = enter.append('g').attr('class', 'force')
        gs.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', d => d.r)
          .attr('fill', 'none')
          .attr('stroke', d => d.color)
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.35)
        gs.append('text')
          .attr('x', 0)
          .attr('y', param.anchor.label.offsetY)
          .attr('text-anchor', 'middle')
          .attr('fill', d => d.color)
          .attr('fill-opacity', 0.5)
          .attr('font-size', param.anchor.label.fontSize)
          .text(d => d.name)
        return gs
      })
  force.attr('transform', d => `translate(${d.x}, ${d.y})`)

  const link = vm.svg.selectAll('line.link')
    .data(links, d => d.id)
    .join('line')
    .attr('class', 'link')
    .attr('stroke-width', d => param.link.strokeWidth)
    .on('click', vm.linkClicked)

  const linkLabel = vm.svg.selectAll('text.link-label')
    .data(links, d => d.id)
    .join('text')
    .text(d => d.action)
    .attr('class', 'link-label')
    .on('click', vm.linkClicked)

  const node = vm.svg.selectAll('g.node')
    .data(nodes, d => d.id)
    .join(
      enter => {
        const gs = enter.append('g').attr('class', 'node')
        gs.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', nodeR)
          .attr('fill', color)
        gs.append('text')
          .attr('x', param.nodeLabel.offsetX)
          .attr('y', param.nodeLabel.offsetY)
          .text(d => d.name)
        return gs
      })
    .on('click', vm.nodeClicked)
    .call(drag(simulation))

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

  vm.isLocked = false
}

function resetLayout() {
  for(const node of nodes) {
    node.fx = null
    node.fy = null
  }
}

export default {
  data() {
    return {
      id: 'uuid-' + uuidv4(),
      svg: null,
      datum: null,
      datumType: null,
      showDatum: false,
      allDomains,
      allLayouts,
      activeLayoutID: null,
      userString: null,
      isEditMode: false,
      isLocked: false,
      layoutEditor: {
        domains: [],
        n: []
      }
    }
  },
  watch: {
    activeLayoutID() {
      console.log('layout:', this.activeLayoutID)
      let redraw = false
      const nextLayout = this.allLayouts.find(l => l.id === this.activeLayoutID)
      if(nextLayout) {
        this.layoutEditor.n.length = 0
        this.layoutEditor.n.push(...nextLayout.n)
        this.layoutEditor.domains.length = 0
        this.layoutEditor.domains.push(...nextLayout.domains)
        redraw = true
      } else {
        // ...
      }
      if(redraw) {
        draw(this)
      }
    },
    userString() {
      // do nothing for now
    },
    'layoutEditor.domains'() {
      console.log('domains:', this.layoutEditor.domains)
      if(this.isEditMode && !this.isLocked) {
        draw(this)
      }
    }
  },
  mounted() {
    this.svg = d3.select(this.$refs.network).append('svg')
    this.activeLayoutID = 'b5' // default
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
    },
    toggleEditMode() {
      const next = !this.isEditMode
      if(next) {
        // do something before entering edit mode
        this.layoutEditor.n.length = 0
        resetLayout()
      }
      this.isEditMode = next
    },
    doImport() {
      let importedLayout = {}
      try {
        importedLayout = JSON.parse(this.userString)
      } catch(e) {
        console.error(e)
      }

      if(Array.isArray(importedLayout.domains) && Array.isArray(importedLayout.n)) {
        this.layoutEditor.n.length = 0
        this.layoutEditor.n.push(...importedLayout.n)
        this.layoutEditor.domains.length = 0
        this.layoutEditor.domains.push(...importedLayout.domains)
        this.activeLayoutID = 'imported-' + (new Date()).getTime()
      }
    },
    doExport() {
      // nodes
      const customizedNodes = []
      customizedNodes.push(...nodes.filter(d => !(d.fx === null && d.fy === null)).map(d => Object.assign({}, {
        id: d.id,
        fx: d.fx,
        fy: d.fy
      })))

      // links
      // nothing yet

      // layout
      this.layoutEditor.n = customizedNodes
      console.log(JSON.stringify(this.layoutEditor))
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
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    font-size: 0.875rem;
    > .panel {
      background-color: white;
      padding: 1rem;
      border-radius: 0.25rem;
      @include shadow;

      &.domains-multiselect {
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
    .layout-editor {
      display: block;
      width: 100%;
      height: 3rem;
      tab-size: 2;
      font-family: "SF Mono", "Monaco", monospace;
      font-size: 0.625rem;
      margin-bottom: 0.25rem;
    }
    button {
      appearance: none;
      margin: 0;
      padding: 0.25rem;
    }
  }
  > .network {
    .force {
      cursor: default;
    }
    .node {
      cursor: pointer;
      > text {
        fill: #222;
      }
    }
    .link {
      stroke: #aaa;
      stroke-opacity: 0.65;
      cursor: pointer;
    }
    .link-label {
      text-anchor: middle;
      fill: #aaa;
      cursor: pointer;
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
