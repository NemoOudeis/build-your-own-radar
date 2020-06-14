export interface Blip {
  description: string
  name: string
  isNew: boolean
  ring: Ring
  quadrant: Quadrant
}

export enum Ring {
  Adopot = 'Adopt',
  Trial = 'Trial',
  Assess = 'Assess',
  Hold = 'Hold',
}

export enum Quadrant {
  Techniques = 'Techniques',
  Platforms = 'Platforms',
  Tools = 'Tools',
  LanguagesAndFrameworks = 'languages-and-frameworks',
}
