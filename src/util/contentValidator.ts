import { Blip } from "./radarData"

import MalformedDataError from '../exceptions/malformedDataError'
import { ExceptionMessages } from './exceptionMessages'

const isSubset = <T>(superSet: T[], subSet: T[]) => {
  return subSet.map(it => superSet.includes(it)).reduce((r,l) => r && l)
}

export const validateBlips = (blips: Blip[], requiredFiels: string[] = ['name', 'ring', 'quadrant', 'isNew', 'description']) => {
  if(blips.length == 0) {
    throw new MalformedDataError(ExceptionMessages.MISSING_CONTENT)
  }
  if(blips.map(blip => isSubset(Object.keys(blip), requiredFiels)).includes(false)) {
    throw new MalformedDataError(ExceptionMessages.MISSING_CONTENT)
  }
}
