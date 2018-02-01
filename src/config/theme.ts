import colors, { COLORS } from './colors'
import sizes, { SIZES } from './sizes'

export interface ThemeInterface {
  colors: {
    primary: COLORS
    highlight: COLORS
    background: COLORS
    plain: COLORS
  }
  sizes: {
    root: string
    headerHeight: string
    centerBlockMaxWidth: string
    centerBlockWidth: string
    logoHOffset: string
    navSpan: string
    dashLineWidth: string
    centerBlockTitleVSpan: string
    navItemHeight: SIZES
    blockTitleHeight: SIZES
    slogan: SIZES
    subscribeBtnFontSize: SIZES
    descFontSize: SIZES
    primaryTitleFontSize: string
    secondaryTitleFontSize: SIZES
    titleColorBlockWidth: string
    titleColorBlockRightSpan: string
    descLeftPadding: string
    descTopPadding: string
    subscribeFormLineHeight: string
    subscribeFormLineWidth: string
    highlightBtnWidth: string
    highlightBtnHeight: string
    historyCircleDiameter: string
    historyCircleBandWidth: string
    historyColBorderBottomWidth: string
    historyItemIconDiameter: string
  }
}

const theme: ThemeInterface = {
  colors,
  sizes,
}

export default theme