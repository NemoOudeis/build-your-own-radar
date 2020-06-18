/* eslint no-constant-condition: "off" */

import * as d3 from 'd3'
const _ = {
  map: require('lodash/map'),
  uniqBy: require('lodash/uniqBy'),
  capitalize: require('lodash/capitalize'),
  each: require('lodash/each')
}

const Radar = require('../models/radar')
const Quadrant = require('../models/quadrant')
const Ring = require('../models/ring')
const Blip = require('../models/blip')
const GraphingRadar = require('../graphing/radar')
const MalformedDataError = require('../exceptions/malformedDataError')
const SheetNotFoundError = require('../exceptions/sheetNotFoundError')
import { ExceptionMessages } from './exceptionMessages'
import { Blip } from './radarData'
import { validateBlips } from './contentValidator'
import { sanitizeBlip } from './inputSanitizer';

const radarData = require('../radar.yaml')

import {Parser, HtmlRenderer} from 'commonmark';

const plotRadar = function (title: string, blips: Blip[], currentRadarName?: string, alternativeRadars?: any[]): void {
  document.title = title
  d3.selectAll('.loading').remove()

  let rings = _.map(_.uniqBy(blips, 'ring'), 'ring')
  let ringMap = {}
  let maxRings = 4

  _.each(rings, function (ringName, i) {
    if (i === maxRings) {
      throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS)
    }
    ringMap[ringName] = new Ring(ringName, i)
  })

  let quadrants = {}
  _.each(blips, function (blip) {
    if (!quadrants[blip.quadrant]) {
      quadrants[blip.quadrant] = new Quadrant(_.capitalize(blip.quadrant))
    }
    quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description))
  })

  let radar = new Radar()
  _.each(quadrants, function (quadrant) {
    radar.addQuadrant(quadrant)
  })

  if (alternativeRadars !== undefined || true) {
    alternativeRadars.forEach(function (sheetName) {
      radar.addAlternative(sheetName)
    })
  }

  if (currentRadarName !== undefined || true) {
    radar.setCurrentSheet(currentRadarName)
  }

  let size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133

  new GraphingRadar(size, radar).init().plot()
}

const renderMarkdown = (markdown: string): string => {
  const parser = new Parser()
  const renderer = new HtmlRenderer();
  return renderer.render(parser.parse(markdown));
}

const buildSheet = (rawBlips: Blip[]): void => {
  try {
    let blips = rawBlips.map(blip => {
      blip.description = renderMarkdown(blip.description);
      return sanitizeBlip(blip);
    })
    validateBlips(blips)
    plotRadar('Our Tech Radar', blips, 'CSV File', [])
  } catch (exception) {
    console.log(exception)
    plotErrorMessage(exception)
  }
}

function setDocumentTitle(): void {
  document.title = 'Build your own Radar'
}

function plotLogo(content: DivSelection): void {
  content.append('div')
    .attr('class', 'input-sheet__logo')
    .html('<a href="https://www.thoughtworks.com"><img src="/images/tw-logo.png" / ></a>')
}

function plotBanner (content: DivSelection, text: string) {
  content.append('div')
    .attr('class', 'input-sheet__banner')
    .html(text)
}

type DivSelection = d3.Selection<HTMLDivElement, unknown, HTMLElement, any>

function plotErrorMessage (exception: any): void {
  let message = 'Oops! It seems like there are some problems with loading your data... 🤷‍♀️'

  let content: DivSelection = d3.select('body')
    .append('div')
    .attr('class', 'input-sheet')
  setDocumentTitle()

  // plotLogo(content)

  let bannerText = "<div><h1>Build your own radar</h1></div>"

  plotBanner(content, bannerText)

  d3.selectAll('.loading').remove()
  if (exception instanceof MalformedDataError) {
    message = message.concat(exception.message)
  } else if (exception instanceof SheetNotFoundError) {
    message = exception.message
  } else {
    console.error(exception)
  }

  const container = content.append('div').attr('class', 'error-container')
  let errorContainer = container.append('div')
    .attr('class', 'error-container__message')
  errorContainer.append('div').append('p')
    .html(message)
}

export function renderRadar() {
  buildSheet(radarData)
}
