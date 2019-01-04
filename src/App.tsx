/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 19:56:35
 * @Last Modified by: Keith-CY
 * @Last Modified time: 2018-07-22 19:57:36
 */

import * as React from 'react'
import { HashRouter as Router, } from 'react-router-dom'
import { MuiThemeProvider, } from '@material-ui/core/styles'

import Routes from './Routes'
import theme from './config/theme'

import { provideObservabls, startSubjectNewBlock, } from './contexts/observables'
import { provideConfig, } from './contexts/config'

const App = () => {
  startSubjectNewBlock()
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Routes />
      </Router>
    </MuiThemeProvider>
  )
}

export default provideConfig(provideObservabls(App))
