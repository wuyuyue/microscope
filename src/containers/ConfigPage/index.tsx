import * as React from 'react'
import { translate } from 'react-i18next'

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Divider,
  Switch
} from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'

import CITAObservables from '@nervos/observables'

import Banner from '../../components/Banner'

import { PanelConfigs } from '../../config/localstorage'
import { initPanelConfigs } from '../../initValues'
import { withObservables } from '../../contexts/observables'
import { withConfig, IConfig } from '../../contexts/config'
import hideLoader from '../../utils/hideLoader'

const layout = require('../../styles/layout.scss')
const styles = require('./config.scss')

/* eslint-disable no-use-before-define */
interface ConfigItem {
  panel: ConfigPanel
  type: ConfigType
  key: string
  title: string
}
/* eslint-enable no-use-before-define */

enum ConfigType {
  DISPLAY,
  COUNT,
  ITEMS,
  VALUE
}

enum ConfigPanel {
  GENERAL = 'general',
  HEADER = 'header',
  BLOCK = 'block',
  TRANSACTION = 'transaction',
  GRAPH = 'graph'
}

export interface IConfigPageProps {
  config: IConfig
  CITAObservables: CITAObservables
  t: (key: string) => string
}

export interface IConfigPageState {
  configs: PanelConfigs
}

const initState: IConfigPageState = {
  configs: initPanelConfigs
}

const ConfigItem = translate('microscope')(
  ({
    config,
    index,
    value,
    handleSwitch,
    handleInput,
    t
  }: {
  config: ConfigItem
  index: number
  value: number | string | boolean | undefined
  handleSwitch: (key: string) => (e: any) => void
  handleInput: (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => void
  t: (key: string) => string
  }) => (
    <ListItem key={config.key}>
      <ListItemText
        primary={
          <React.Fragment>
            {t(config.type === ConfigType.DISPLAY ? 'display' : 'set')} {t(config.title)}
          </React.Fragment>
          // ' ' +
        }
      />
      <ListItemSecondaryAction>
        {config.type === ConfigType.DISPLAY ? (
          <Switch
            classes={{
              bar: styles.switchBar,
              checked: styles.switchChecked,
              colorPrimary: styles.switchColorPrimary,
              colorSecondary: styles.switchColorSecondary,
              // bar: styles.iOSBar,
              icon: styles.iOSIcon
            }}
            onChange={handleSwitch(config.key)}
            checked={!!value}
          />
        ) : (
          <div>
            <TextField
              value={`${value}`}
              onChange={handleInput(config.key)}
              // style={{ textAlign: 'right' }}
            />
          </div>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
)

const Config = translate('microscope')(
  ({
    title,
    configs,
    values,
    handleSwitch,
    handleInput,
    t
  }: {
  title: any
  configs: any
  values: any
  handleSwitch: any
  handleInput: any
  t: any
  }) => (
    <ExpansionPanel defaultExpanded classes={{ root: styles.panel }} elevation={0}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="caption" classes={{ caption: styles.panelTitle }}>
          {t(title)} {t('config')}
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <ExpansionPanelDetails>
        <List style={{ width: '100%' }}>
          {configs.map((config, idx) => (
            <ConfigItem
              key={config.key}
              config={config}
              index={idx}
              value={values[config.key]}
              handleSwitch={handleSwitch}
              handleInput={handleInput}
            />
          ))}
        </List>
      </ExpansionPanelDetails>
      <Divider />
    </ExpansionPanel>
  )
)

class ConfigPage extends React.Component<IConfigPageProps, IConfigPageState> {
  // state: IConfigPageState
  constructor (props) {
    super(props)
    this.state = {
      configs: this.props.config.panelConfigs
    }
  }

  componentDidMount () {
    hideLoader()
  }
  private handleSwitch = key => (e: any) => {
    this.setState(state => {
      const { configs } = this.state
      const newConfig = { ...configs, [key]: !configs[key] }
      if (this.props.config.changePanelConfig(newConfig)) {
        return { configs: newConfig }
      }
      return state
    })
  }
  private handleInput = key => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState(state => {
      const { configs } = state
      const newConfig = { ...configs, [key]: value }
      if (this.props.config.changePanelConfig(newConfig)) {
        return { configs: newConfig }
      }
      return state
    })
  }
  private panels = [
    // ConfigPanel.GENERAL,
    // ConfigPanel.HEADER,
    ConfigPanel.BLOCK,
    ConfigPanel.TRANSACTION,
    ConfigPanel.GRAPH
  ]
  private configs = [
    {
      panel: ConfigPanel.GENERAL,
      type: ConfigType.VALUE,
      key: 'logo',
      title: 'logo'
    },
    {
      panel: ConfigPanel.HEADER,
      type: ConfigType.DISPLAY,
      key: 'TPS',
      title: 'TPS'
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.DISPLAY,
      key: 'blockHeight',
      title: 'height'
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.DISPLAY,
      key: 'blockHash',
      title: 'hash'
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.DISPLAY,
      key: 'blockAge',
      title: 'age'
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.DISPLAY,
      key: 'blockTransactions',
      title: 'transactions'
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.DISPLAY,
      key: 'blockGasUsed',
      title: 'gas used'
    },
    {
      panel: ConfigPanel.BLOCK,
      type: ConfigType.VALUE,
      key: 'blockPageSize',
      title: 'page size'
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionHash',
      title: 'hash'
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionFrom',
      title: 'from'
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionTo',
      title: 'to'
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionValue',
      title: 'value'
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionAge',
      title: 'age'
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionBlockNumber',
      title: 'block number'
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.DISPLAY,
      key: 'transactionGasUsed',
      title: 'gas used'
    },
    {
      panel: ConfigPanel.TRANSACTION,
      type: ConfigType.VALUE,
      key: 'transactionPageSize',
      title: 'page size'
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.DISPLAY,
      key: 'graphIPB',
      title: 'Interval/Block'
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.DISPLAY,
      key: 'graphTPB',
      title: 'Transactions/Block'
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.DISPLAY,
      key: 'graphGasUsedBlock',
      title: 'Gas Used/Block'
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.DISPLAY,
      key: 'graphGasUsedTx',
      title: 'Gas Used/Transaction'
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.DISPLAY,
      key: 'graphProposals',
      title: 'Proposals/Validator'
    },
    {
      panel: ConfigPanel.GRAPH,
      type: ConfigType.VALUE,
      key: 'graphMaxCount',
      title: 'MaxCount'
    }
  ] as ConfigItem[]
  render () {
    return (
      <React.Fragment>
        <Banner bg={`${process.env.PUBLIC}/banner/banner-Setting.png`}>Config</Banner>
        <div className={`${styles.main} ${layout.center}`}>
          {this.panels.map(panel => (
            <Config
              title={panel}
              key={panel}
              configs={this.configs.filter(config => config.panel === panel)}
              values={this.state.configs}
              handleSwitch={this.handleSwitch}
              handleInput={this.handleInput}
            />
          ))}
        </div>
      </React.Fragment>
    )
  }
}

export default withConfig(withObservables(ConfigPage))
