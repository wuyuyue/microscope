import { initBlock, initMetadata } from '../../initValues'
import { IContainerProps } from '../../typings'
import { ServerList } from '../../components/MetadataPanel'

const initState = {
  keyword: '',
  metadata: initMetadata,
  sidebarNavs: false,
  activePanel: window.urlParamChain || window.localStorage.getItem('chainIp') ? '' : 'metadata',
  searchIp: '',
  otherMetadata: initMetadata,
  tps: 0,
  tpb: 0,
  ipb: 0,
  peerCount: 0,
  block: initBlock,
  anchorEl: undefined,
  lngOpen: false,
  lng: window.localStorage.getItem('i18nextLng'),
  inputChainError: false,
  waitingMetadata: false,
  error: {
    code: '',
    message: ''
  },
  overtime: 0,
  serverList: [] as ServerList
}
type HeaderState = typeof initState
interface HeaderProps extends IContainerProps {}

export { initState, HeaderState, HeaderProps }
