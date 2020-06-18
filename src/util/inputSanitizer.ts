import { Blip } from "./radarData";
import sanitizeHtml from 'sanitize-html';

const relaxedOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul',
    'br', 'p', 'u'],
  allowedAttributes: {
    a: ['href']
  }
}

const restrictedOptions = {
  allowedTags: [],
  allowedAttributes: {},
  textFilter: (text: string): string => {
    return text.replace(/&amp;/, '&')
  }
}

export const sanitizeBlip = function (rawBlip: Blip): Blip {
  var blip = trimWhiteSpaces(rawBlip)
  blip.description = sanitizeHtml(blip.description, relaxedOptions)
  blip.name = sanitizeHtml(blip.name, restrictedOptions)
  blip.isNew = sanitizeHtml(blip.isNew, restrictedOptions)
  blip.ring = sanitizeHtml(blip.ring, restrictedOptions)
  blip.quadrant = sanitizeHtml(blip.quadrant, restrictedOptions)

  return blip
}

function trimWhiteSpaces (blip: Blip): Blip {
  for(const key in blip) {
    blip[key] = (typeof blip[key] === 'string') ? blip[key].trim() : blip[key]
  }
  return blip
}
