export interface ISocialBoxProps {
  social: 'instagram' | 'facebook' | 'tikTok' | 'linkedIn'
  socials: ISocialProps
  exists: boolean
  getSocials: () => void
}

export interface ISocialProps {
  instagram: string
  facebook: string
  tikTok: string
  linkedIn: string
}
