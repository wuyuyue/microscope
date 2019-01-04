import * as React from 'react'
import { withObservables, } from '../../contexts/observables'
import { copyToClipboard, } from '../../utils/copyToClipboard'

const styles = require('./styles.scss')

const Infoblock = ({ title, code, copied, copy, }) => (
  <div className={styles.infoblock}>
    <div className={styles.header}>
      <span className={styles.title}>{title}</span>
      <button
        className={copied ? styles.copied : ''}
        onClick={copy}
        disabled={copied}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
    <pre className={styles.code}>{code}</pre>
  </div>
)

interface PanelProps {
  abi: string
  code: string
  copiedIdx: number
  updateCopiedIdx: (idx: number) => void
}

const Panel = (props: PanelProps) => {
  const abi = JSON.stringify(props.abi, null, 2)
  const { code, } = props
  return (
    <div>
      <Infoblock
        title="Contract Abi"
        code={abi}
        copied={props.copiedIdx === 0}
        copy={e => {
          if (props.copiedIdx === 0) return
          copyToClipboard(abi)
          props.updateCopiedIdx(0)
        }}
      />
      <Infoblock
        title="Contract Creation Code"
        code={code}
        copied={props.copiedIdx === 1}
        copy={e => {
          if (props.copiedIdx === 1) return
          copyToClipboard(code)
          props.updateCopiedIdx(1)
        }}
      />
    </div>
  )
}
export default withObservables(Panel)
