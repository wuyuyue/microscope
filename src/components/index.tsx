import * as React from 'react'
import { LinearProgress as MaterialLinearProgress, } from '@material-ui/core'

const LinearProgress = ({ loading, root = 'linearProgressRoot', }) =>
  loading > 0 ? <MaterialLinearProgress classes={{ root, }} /> : null

export { LinearProgress, }
export default { LinearProgress, }
