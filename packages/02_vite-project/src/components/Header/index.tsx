// import './index.scss'
import styles from './index.module.scss'
import React, { useEffect } from 'react'
import { devDependencies } from '../../../package.json'
import { debounce } from 'lodash-es'

import ImgSrc from '@assets/kdy.jpeg'

// “?” + worker 等于告诉vite这里是 web worker
import Worker from './example.js?worker'

const worker = new Worker()

window.addEventListener('message', e => {
  console.log(e.data)
})

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

function c () {
  console.log(1234)
}

function demo () {
  debounce(c, 3000)
}

export function Header () {
  useEffect(() => {
    const img = document.getElementById('logo') as HTMLImageElement
    img.src = ImgSrc
  }, [])

  return (
    <div>
      <img id="logo" src={ImgSrc} />
      <div style={{width: '100px', height: '100px', background: 'red'}} onClick={demo}>测试lodash-es</div>
      <img src={new URL('../../assets/kdy.jpeg', import.meta.env.VITE_IMG_BASE_URL).href} alt="" />
    </div>
  )
}
