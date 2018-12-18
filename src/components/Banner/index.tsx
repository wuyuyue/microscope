import * as React from 'react'

const styles = require('./banner.scss')

const Banner = ({ bg, children, }: { bg?: string; children?: any }) => (
  <div
    className={styles.banner}
    style={
      bg
        ? {
          backgroundImage: `url(${bg})`,
        }
        : {}
    }
  >
    {children}
  </div>
)
export default Banner
