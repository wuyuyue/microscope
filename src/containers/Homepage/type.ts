import { IContainerProps, } from '../../typings'
import { initHomePageState, } from '../../initValues'

interface HomepageProps extends IContainerProps {}
type HomepageState = typeof initHomePageState

export { HomepageProps, HomepageState, }
