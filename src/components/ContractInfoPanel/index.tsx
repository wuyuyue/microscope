import * as React from 'react'
// import { List, Divider, } from '@material-ui/core'
// import { ABI, ABIElement, } from '../../typings'
import { withObservables, } from '../../contexts/observables'
import { copyToClipboard, } from '../../utils/copyToClipboard'
// import { handleError, dismissError, } from '../../utils/handleError'

const styles = require('./styles.scss')

const Infoblock = ({ title, code, }) => (
  <div className={styles.infoblock}>
    <div className={styles.header}>
      <span className={styles.title}>{title}</span>
      <button className={styles.button} onClick={() => copyToClipboard(code)}>
        Copy
      </button>
    </div>
    <pre className={styles.code}>{code}</pre>
  </div>
)

interface PanelProps {
  CITAObservables: any
  // account: string
  abi: any
  code: string
}

const Panel = (props: PanelProps) => {
  // const { abi, code } = this.state
  const abi = JSON.stringify(props.abi, null, 2)
  const { code, } = props
  return (
    <div>
      <Infoblock title="Contract Abi" code={abi} />
      <Infoblock title="Contract Creation Code" code={code} />
    </div>
  )
}

export default withObservables(Panel)
