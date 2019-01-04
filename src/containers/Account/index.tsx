/*
 * @Author: Keith-CY
 * @Date: 2018-07-22 21:41:37
 * @Last Modified by: Keith-CY
 * @Last Modified time: 2018-09-11 14:49:56
 */

import * as React from 'react'
import * as web3Utils from 'web3-utils'
import * as Web3Contract from 'web3-eth-contract'
import * as web3Abi from 'web3-eth-abi'

import {
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
} from '@material-ui/core'

import ERCPanel from '../../components/ERCPanel'
import TransactionTable from '../../containers/TransactionTable'
import Banner from '../../components/Banner'
import ErrorNotification from '../../components/ErrorNotification'
import ContractInfoPanel from '../../components/ContractInfoPanel'

import { AccountType, } from '../../typings/account'
import { IContainerProps, } from '../../typings'
import { withObservables, } from '../../contexts/observables'

import { initAccountState, } from '../../initValues'
import hideLoader from '../../utils/hideLoader'
import { handleError, dismissError, } from '../../utils/handleError'
import valueFormatter from '../../utils/valueFormatter'

const layouts = require('../../styles/layout.scss')
const text = require('../../styles/text.scss')
const styles = require('./styles.scss')

const accountFormatter = (addr: string) =>
  /^0x/i.test(addr) ? addr : `0x${addr}`
interface AccountProps extends IContainerProps {}
type AccountState = typeof initAccountState
class Account extends React.Component<AccountProps, AccountState> {
  readonly state = initAccountState;
  public componentWillMount () {
    const { account, } = this.props.match.params
    this.onMount(account)
  }
  public componentDidMount () {
    hideLoader()
  }
  public componentWillReceiveProps (nextProps: AccountProps) {
    const { account, } = nextProps.match.params
    if (account && account !== this.props.match.params.account) {
      this.onMount(account)
    }
  }
  public componentDidCatch (err) {
    this.handleError(err)
  }
  private onMount = accountInput => {
    const account = accountFormatter(accountInput)
    this.setState(initAccountState)
    this.updateBasicInfo(account)
    this.fetchContractCode(account)
  };
  private onTabClick = (e, value) => {
    this.setState({ panelOn: value, })
  };

  private setTransactionsCount = count => this.setState({ txCount: count, });
  private copyPending: any;
  private fetchContractCode = account =>
    this.props.CITAObservables.getCode({
      contractAddr: account,
      blockNumber: 'latest',
    }).subscribe(code => this.setState({ code, }))
  protected readonly addrGroups = [
    {
      key: 'normals',
      label: AccountType.NORMAL,
    },
    {
      key: 'erc20s',
      label: AccountType.ERC20,
    },
    {
      key: 'erc721s',
      label: AccountType.ERC721,
    },
  ];
  private fetchInfo = addr => {
    // NOTE: async
    this.setState(state => ({ loading: state.loading + 2, })) // for get balance, get transaction count, and get abi
    this.props.CITAObservables.getBalance({ addr, blockNumber: 'latest', })
      // .finally(() => this.setState(state => ({ loading: state.loading - 1 })))
      .subscribe(
        (balance: string) =>
          this.setState(state => ({
            loading: state.loading - 1,
            balance: `${+balance}`,
          })),
        this.handleError
      )

    this.props.CITAObservables.getAbi({
      contractAddr: addr,
      blockNumber: 'latest',
    }).subscribe(encoded => {
      if (encoded === '0x') {
        this.setState(state => ({ loading: state.loading - 1, }))
      } else {
        try {
          const abiStr = web3Utils.hexToUtf8(encoded as string)
          const abi = JSON.parse(abiStr).filter(
            (a: any) => a.type === 'function'
          )
          const contract = new Web3Contract(abi, this.state.addr)
          this.setState(state => ({
            abi,
            contract,
            loading: state.loading - 1,
          }))
        } catch (err) {
          this.handleError(err)
        }
      }
    }, this.handleError)
  };
  private updateBasicInfo = account => {
    if (account) {
      const addr = accountFormatter(account)
      this.setState({
        addr,
      })
      this.fetchInfo(addr)
    }
  }
  private handleAbiValueChange = (index: number) => (
    inputIndex: number
  ) => e => {
    const { value, } = e.target
    this.setState(state => {
      const abi = [...state.abi, ]
      const oldInput = abi[index].inputs[inputIndex]
      const newInput = { ...oldInput, value, }
      abi[index].inputs[inputIndex] = newInput
      return { ...state, abi, }
    })
  };
  private handleEthCall = (index: number) => e => {
    const inputs = this.state.abi[index].inputs.map(input => ({
      name: input.name,
      value: input.value,
    }))
    /* eslint-disable no-underscore-dangle */
    const jsonInterface = this.state.contract._jsonInterface[index]
    /* eslint-enable no-underscore-dangle */
    // send transform data

    try {
      const data = web3Abi.encodeFunctionCall(
        jsonInterface,
        inputs.map(input => input.value)
      )
      this.setState(state => ({ loading: state.loading + 1, })) // for eth call
      /**
       * @method eth_call
       */
      this.props.CITAObservables.ethCall({
        callObject: {
          to: this.state.addr,
          data,
        },
        blockNumber: 'latest',
      }).subscribe(result => {
        try {
          const outputTypes = this.state.abi[index].outputs.map(o => o.type)
          const outputs = web3Abi.decodeParameters(outputTypes, result) as {
            [index: string]: any
            __length__: number
          }
          this.setState(state => {
            const abi = JSON.parse(JSON.stringify(state.abi))
            for (let i = 0; i < outputs.__length__; i++) {
              abi[index].outputs[i].value = outputs[i].toString()
            }
            return { ...state, abi, loading: state.loading - 1, }
          })
        } catch (err) {
          console.warn(err)
          this.handleError(err)
        }
      }, this.handleError)
    } catch (err) {
      console.warn(err)
      this.handleError(err)
    }
  };
  private updateCopiedIdx = (copiedIdx: number) => {
    this.setState({ copiedIdx, })
    this.copyPending = setTimeout(() => {
      clearTimeout(this.copyPending)
      this.setState({ copiedIdx: -1, })
    }, 3000)
  };
  private handleError = handleError(this);
  private dismissError = dismissError(this);
  private renderPanelByTab = () => {
    const { abi, addr, panelOn, code, } = this.state
    const erc = (
      <ERCPanel
        abi={abi.filter(abiEl => abiEl.type === 'function')}
        handleAbiValueChange={this.handleAbiValueChange}
        handleEthCall={this.handleEthCall}
      />
    )
    const tx = (
      <TransactionTable
        {...this.props}
        key={addr}
        setTransactionsCount={this.setTransactionsCount}
        inset
      />
    )
    const info = (
      <ContractInfoPanel
        code={code}
        abi={abi}
        updateCopiedIdx={this.updateCopiedIdx}
        copiedIdx={this.state.copiedIdx}
      />
    )
    const table = {
      tx,
      abi: erc,
      info,
    }
    return table[panelOn]
  };
  render () {
    const {
      loading,
      addr,
      balance,
      txCount,
      panelOn,
      abi,
      code,
      error,
    } = this.state

    return (
      <React.Fragment>
        {loading ? (
          <LinearProgress
            classes={{
              root: 'linearProgressRoot',
            }}
          />
        ) : null}

        <Banner />
        <div className={layouts.main}>
          <div className={styles.basicInfo}>
            <div className={text.bannerText}>
              Account:
              <span>{addr}</span>
            </div>
            <div className={text.bannerText}>
              Balance:
              <span>{valueFormatter(balance)}</span>
            </div>
          </div>
          <Card classes={{ root: layouts.cardContainer, }} elevation={0}>
            <CardContent>
              <Tabs value={panelOn} onChange={this.onTabClick}>
                <Tab value="tx" label={`Transactions(${txCount || 0})`} />
                {abi && abi.length ? (
                  <Tab value="abi" label="Contract Panel" />
                ) : null}
                {code === '0x' ? null : (
                  <Tab value="info" label="Contract Info" />
                )}
              </Tabs>
              <Divider />
              {this.renderPanelByTab()}
            </CardContent>
          </Card>
        </div>
        <ErrorNotification error={error} dismissError={this.dismissError} />
      </React.Fragment>
    )
  }
}

export default withObservables(Account)
