// import './index.scss'
import styles from './index.module.scss'
import React, { useEffect } from 'react'
import { devDependencies } from '../../../package.json'

import ImgSrc from '@assets/kdy.jpeg'

// export function Header () {
//   return <p className={styles.header}>this is Header</p>
// }

// export function Header () {
//   return (
//     <div>
//       <img src={ImgSrc} />
//     </div>
//   )
// }

export function Header () {
  useEffect(() => {
    const img = document.getElementById('logo') as HTMLImageElement
    img.src = ImgSrc
  }, [])
  return (
    <div>
      <img id="logo" src={ImgSrc} />
    </div>
  )
}
