import { IContainerProps, } from '../../typings'
import { initHomePageState as initState, } from '../../initValues'

interface HomepageProps extends IContainerProps {}
type HomepageState = typeof initState

export { HomepageProps, HomepageState, }
